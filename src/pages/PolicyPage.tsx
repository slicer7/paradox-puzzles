import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NotFound from "./NotFound";

interface PolicySection {
  heading: string;
  body: string[];
}

interface Policy {
  title: string;
  updated: string;
  sections: PolicySection[];
}

const CONTACT_LINE =
  "Questions about this policy? Email us at paradoxpuzzlebox@gmail.com and we'll get back to you within one business day.";

const POLICIES: Record<string, Policy> = {
  "shipping-returns": {
    title: "Shipping & Returns",
    updated: "July 2026",
    sections: [
      {
        heading: "Processing time",
        body: [
          "Every Paradox puzzle box is 3D-printed and inspected to order in our workshop. Orders are processed and shipped within 3–5 business days of purchase. You'll receive a confirmation email with tracking as soon as your order ships.",
        ],
      },
      {
        heading: "Shipping rates & delivery",
        body: [
          "US orders over $35 ship free. Orders under $35 ship at a flat rate calculated at checkout.",
          "US delivery typically takes 3–5 business days after your order ships. We currently ship within the United States; if you're outside the US and would like to order, email us and we'll see what we can do.",
        ],
      },
      {
        heading: "Returns",
        body: [
          "Unopened boxes can be returned within 30 days of delivery for a full refund. To start a return, email paradoxpuzzlebox@gmail.com with your order number.",
          "Because our puzzles are made to order, we ask that return shipping be covered by the customer unless the item arrived damaged or defective.",
        ],
      },
      {
        heading: "Damaged or defective items",
        body: [
          "Every box is tested before it ships, but if yours arrives damaged or a mechanism doesn't work the way it should, we'll make it right. Email us a photo within 30 days of delivery and we'll send a replacement or issue a full refund — your choice.",
        ],
      },
    ],
  },
  "privacy-policy": {
    title: "Privacy Policy",
    updated: "July 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "When you place an order, our checkout provider Shopify collects the information needed to fulfill it: your name, email address, shipping address, and payment details. We (Paradox Puzzles) see your order and contact details, but never your payment information — that is handled entirely by Shopify's PCI-compliant systems.",
        ],
      },
      {
        heading: "How we use it",
        body: [
          "We use your information to fulfill orders, respond to questions, and handle returns or replacements. We do not sell or share your personal information with third parties for marketing purposes.",
        ],
      },
      {
        heading: "Cookies & analytics",
        body: [
          "Our cart uses your browser's local storage to remember what's in it between visits. Shopify may set cookies required for checkout to function.",
        ],
      },
      {
        heading: "Your choices",
        body: [
          "You can request a copy of the personal information we hold about you, or ask us to delete it, by emailing paradoxpuzzlebox@gmail.com.",
        ],
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    updated: "July 2026",
    sections: [
      {
        heading: "Overview",
        body: [
          "This website is operated by Paradox Puzzles. By purchasing from us, you agree to these terms. Orders and payments are processed through Shopify's secure checkout.",
        ],
      },
      {
        heading: "Products & pricing",
        body: [
          "We do our best to display our products and their colors accurately, but slight variations can occur between screens and between individual 3D prints — that's part of what makes each box unique. Prices are shown in USD and may change at any time; the price at checkout is the price you pay.",
        ],
      },
      {
        heading: "Orders",
        body: [
          "We reserve the right to refuse or cancel any order (for example, in cases of suspected fraud or pricing errors). If we cancel your order, you'll receive a full refund.",
        ],
      },
      {
        heading: "Safety",
        body: [
          "Puzzle boxes contain small parts and are not intended for children under 3 years old.",
        ],
      },
      {
        heading: "Intellectual property",
        body: [
          "All puzzle designs, product photos, and site content are the property of Paradox Puzzles and may not be reproduced or resold without permission.",
        ],
      },
    ],
  },
};

const PolicyPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const policy = slug ? POLICIES[slug] : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!policy) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-body text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to store
          </Link>

          <h1 className="font-display text-4xl md:text-5xl font-semibold text-gradient-gold mb-3">
            {policy.title}
          </h1>
          <p className="font-body text-sm text-muted-foreground mb-10">
            Last updated: {policy.updated}
          </p>

          <div className="space-y-10">
            {policy.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                  {section.heading}
                </h2>
                {section.body.map((paragraph, i) => (
                  <p key={i} className="font-body text-muted-foreground leading-relaxed mb-3">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}

            <p className="font-body text-muted-foreground leading-relaxed border-t border-border pt-8">
              {CONTACT_LINE}
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PolicyPage;
