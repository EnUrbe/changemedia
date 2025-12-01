import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Tailwind,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface BookingConfirmationEmailProps {
  clientName: string;
  serviceType: string;
  dateStr: string;
}

export const BookingConfirmationEmail = ({
  clientName,
  serviceType,
  dateStr,
}: BookingConfirmationEmailProps) => {
  const previewText = `Booking Confirmed: ${serviceType}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                brand: "#5c7cfa",
                background: "#0f172a",
                surface: "#1e293b",
                text: "#ffffff",
                muted: "#94a3b8",
                border: "#334155",
              },
            },
          },
        }}
      >
        <Body className="bg-background font-sans my-auto mx-auto px-2">
          <Container className="border border-solid border-border rounded-lg my-[40px] mx-auto p-[20px] max-w-[465px] bg-surface">
            <Section className="mt-[32px]">
              <Heading className="text-white text-[24px] font-normal text-center p-0 my-[30px] mx-0 uppercase tracking-widest">
                Change <span className="text-brand font-bold">Media</span>
              </Heading>
            </Section>
            
            <Heading className="text-white text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Booking Confirmed
            </Heading>
            
            <Text className="text-muted text-[14px] leading-[24px] text-center">
              Hi {clientName}, your session has been successfully scheduled. We're
              looking forward to collaborating with you.
            </Text>

            <Section className="bg-background rounded-lg p-5 my-6 border border-solid border-border">
              <Row className="mb-4 border-b border-solid border-border pb-4">
                <Column>
                  <Text className="text-muted text-[12px] uppercase tracking-wider m-0 mb-1">
                    Service
                  </Text>
                  <Text className="text-white text-[16px] font-medium m-0">
                    {serviceType}
                  </Text>
                </Column>
              </Row>
              <Row>
                <Column>
                  <Text className="text-muted text-[12px] uppercase tracking-wider m-0 mb-1">
                    Date & Time
                  </Text>
                  <Text className="text-white text-[16px] font-medium m-0">
                    {dateStr}
                  </Text>
                </Column>
              </Row>
            </Section>

            <Text className="text-muted text-[14px] leading-[24px] text-center">
              A calendar invitation has been attached to this email.
              <br />
              Please check the details and let us know if you need to make any
              changes.
            </Text>
            
            <Section className="mt-[32px] mb-[32px]">
              <Text className="text-slate-500 text-[12px] text-center">
                © {new Date().getFullYear()} CHANGE Media. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default BookingConfirmationEmail;
