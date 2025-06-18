import { NextRequest, NextResponse } from 'next/server';
import { protectApiRoute, rateLimit, sanitizeInput } from '@/app/lib/auth-utils';
import { prisma } from '@/app/lib/prisma/client';
import { Prisma, ReturnStatus } from '@prisma/client';

// GET - Fetch returns with pagination
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(clientIP, 10, 60000)) { 
      return NextResponse.json(
        { error: 'Rate limit exceeded' }, 
        { status: 429 }
      );
    }

    // Authentication check
    const session = await protectApiRoute();
    if (session instanceof NextResponse) {
      return session; 
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100); // Max 100 items
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Build where clause
    const where: Prisma.ReturnWhereInput = {};
    if (status) {
      where.status = status as ReturnStatus;
    }
    if (search) {
      where.OR = [
        { customerEmail: { contains: sanitizeInput(search), mode: 'insensitive' } },
        { orderId: { contains: sanitizeInput(search), mode: 'insensitive' } }
      ];
    }

    // Fetch returns with pagination
    const [returns, total] = await Promise.all([
      prisma.return.findMany({
        where,
        include: {
          items: true
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.return.count({ where })
    ]);

    return NextResponse.json({
      returns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create new return
export async function POST(request: NextRequest) {
  try {
    // Rate limiting (stricter for POST)
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!rateLimit(clientIP, 10, 60000)) { // 10 requests per minute
      return NextResponse.json(
        { error: 'Rate limit exceeded' }, 
        { status: 429 }
      );
    }

    // Authentication check
    const session = await protectApiRoute();
    if (session instanceof NextResponse) {
      return session;
    }

    const body = await request.json();
    
    // Input validation
    const { customerEmail, orderId, orderNumber, customerId, items } = body;
    
    if (!customerEmail || !orderId || !orderNumber || !customerId || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(customerEmail);
    const sanitizedOrderId = sanitizeInput(orderId);
    const sanitizedCustomerId = sanitizeInput(customerId);

    // Create return
    const newReturn = await prisma.return.create({
      data: {
        customerEmail: sanitizedEmail,
        orderId: sanitizedOrderId,
        orderNumber: parseInt(orderNumber),
        customerId: sanitizedCustomerId,
        status: 'PENDING',
        items: {
          create: items.map((item: { reason: string; productName?: string; variant?: string; quantity?: number }) => ({
            reason: sanitizeInput(item.reason),
            productName: sanitizeInput(item.productName || ''),
            variant: sanitizeInput(item.variant || ''),
            quantity: parseInt(String(item.quantity)) || 1
          }))
        }
      },
      include: {
        items: true
      }
    });

    return NextResponse.json(newReturn, { status: 201 });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 