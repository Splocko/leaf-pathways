import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email, firstName } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required.' },
        { status: 400 }
      );
    }

    if (!firstName || typeof firstName !== 'string' || !firstName.trim()) {
      return NextResponse.json(
        { error: 'First name is required.' },
        { status: 400 }
      );
    }

    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const SEGMENT_ID = process.env.RESEND_SEGMENT_ID;
    const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'LEAF Pathways <noreply@leafpathways.com>';

    if (!RESEND_API_KEY) {
      console.error('Missing RESEND_API_KEY environment variable');
      return NextResponse.json(
        { error: 'Server configuration error.' },
        { status: 500 }
      );
    }

    const resolvedName = firstName.trim();

    const contactPayload: Record<string, unknown> = {
      email,
      firstName: resolvedName,
      unsubscribed: false,
    };

    // Add to "Newsletter" segment if configured
    if (SEGMENT_ID) {
      contactPayload.segments = [{ id: SEGMENT_ID }];
    }

    console.log('Creating contact:', { email, firstName: resolvedName, segmentId: SEGMENT_ID || 'none' });

    // New Resend Global Contacts API — no audience ID needed
    const res = await fetch('https://api.resend.com/contacts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contactPayload),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error('Resend API error:', res.status, body);
      return NextResponse.json(
        { error: body?.message ?? 'Failed to subscribe.' },
        { status: res.status }
      );
    }

    // Send welcome email via Resend template (best-effort — don't fail the subscription if this errors)
    const WELCOME_TEMPLATE_ID = process.env.RESEND_WELCOME_TEMPLATE_ID;
    if (WELCOME_TEMPLATE_ID) {
      try {
        const emailPayload: Record<string, unknown> = {
          from: FROM_EMAIL,
          to: [email],
          template: {
            id: WELCOME_TEMPLATE_ID,
            // FIRST_NAME, LAST_NAME, EMAIL, UNSUBSCRIBE_URL are auto-populated by Resend
            // Add any custom variables from your template here:
            variables: {},
          },
        };
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(emailPayload),
        });
        console.log('Welcome email sent to:', email);
      } catch (emailErr) {
        console.error('Welcome email failed (non-blocking):', emailErr);
      }
    } else {
      console.log('No RESEND_WELCOME_TEMPLATE_ID set — skipping welcome email');
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Newsletter subscription error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred.' },
      { status: 500 }
    );
  }
}
