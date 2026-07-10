"use server";

import midtransClient from "midtrans-client";
import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types/general";
import { environment } from "@/configs/environment";

type GeneratePaymentTokenParams = {
  id: string;
};

export async function generatePaymentToken(
  params: GeneratePaymentTokenParams,
): Promise<ActionResponse<{ paymentToken: string }>> {
  const { id } = params;
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderMenus: {
          select: {
            quantity: true,
            nominal: true,
            menu: {
              select: {
                price: true,
                discount: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      return {
        success: false,
        error: {
          message: "Order not found",
        },
      };
    }

    let paymentToken = "";

    if (order.paymentToken) {
      paymentToken = order.paymentToken;
    } else {
      let snap = new midtransClient.Snap({
        isProduction: environment.MIDTRANS_IS_PRODUCTION,
        serverKey: environment.MIDTRANS_SERVER_KEY,
        clientKey: environment.MIDTRANS_CLIENT_KEY,
      });

      const subtotal = order.orderMenus.reduce((total, orderMenu) => {
        return orderMenu.nominal + total;
      }, 0);

      const tax = subtotal * 0.12; // 12%
      const service = subtotal * 0.05; // 5%
      const grossAmount = subtotal + tax + service;

      let parameter = {
        transaction_details: {
          order_id: order.orderId,
          gross_amount: grossAmount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: order.customerName,
        },
      };

      paymentToken = await snap
        .createTransaction(parameter)
        .then((transaction) => transaction.token);

      await prisma.order.update({
        where: {
          id: order.id,
        },
        data: {
          paymentToken,
        },
      });
    }

    return {
      success: true,
      data: {
        paymentToken,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: {
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate payment token",
      },
    };
  }
}
