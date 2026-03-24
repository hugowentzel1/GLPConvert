"use client";

import { useState } from "react";
import FocusTrap from "@/components/ui/FocusTrap";

interface ReportLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; email: string; phone?: string; address?: string; preferredContactMethod?: "call" | "email"; notes?: string }) => Promise<void>;
  address?: string;
  brandColor?: string;
  /** Installer/company name for consent: "contacted by [Company] via ..." */
  companyName?: string;
  /** Optional booking URL (e.g. Calendly); "Book a time" opens this then closes. */
  bookingUrl?: string;
}

export default function ReportLeadModal({
  isOpen,
  onClose,
  onSubmit,
  address = "",
  brandColor = "#0ea5e9",
  companyName,
  bookingUrl,
}: ReportLeadModalProps) {
  const raw = companyName && companyName.trim() ? companyName.trim() : "";
  const consentCompany = !raw || raw.toLowerCase() === "sunspire" ? "the company" : raw;
  const displayCompany = raw && raw.toLowerCase() !== "paid" ? raw : "Your installer";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [preferredContact, setPreferredContact] = useState<"call" | "email" | "">("");
  const [consent, setConsent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !email.trim()) {
      setError("Name and email are required.");
      return;
    }
    if (!preferredContact) {
      setError("Please choose how you'd like to be contacted.");
      return;
    }
    if (!consent) {
      setError("Please agree to be contacted.");
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address || undefined,
        preferredContactMethod: preferredContact as "call" | "email",
        notes: notes.trim() || undefined,
      });
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="report-lead-modal-title">
      <FocusTrap>
        <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div className="p-10 md:p-12 flex flex-col">
            {!success ? (
              <>
                <h2 id="report-lead-modal-title" className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
                  Book your free consultation
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed mb-5">
                  Share your details below. {displayCompany} will call or email you within 1–2 business days to schedule your free consultation—a short, no-pressure call to discuss your estimate and next steps. No obligation.
                </p>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-5">
                  {/* GROUP 1 — field stack: one consistent internal rhythm */}
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="report-lead-name" className="block text-sm font-medium text-gray-700 mb-2">First name *</label>
                      <input
                        id="report-lead-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                        style={{ outlineColor: brandColor }}
                      />
                    </div>
                    <div>
                      <label htmlFor="report-lead-email" className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                      <input
                        id="report-lead-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                        style={{ outlineColor: brandColor }}
                      />
                    </div>
                    <div>
                      <label htmlFor="report-lead-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone (optional)</label>
                      <input
                        id="report-lead-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 000-0000"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900"
                        style={{ outlineColor: brandColor }}
                      />
                    </div>
                    <div>
                      <label htmlFor="report-lead-notes" className="block text-sm font-medium text-gray-700 mb-2">Any additional comments or notes? (optional)</label>
                      <textarea
                        id="report-lead-notes"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. timeline, questions, or how you'd like to be contacted"
                        rows={3}
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-0 focus:border-transparent text-gray-900 resize-y"
                        style={{ outlineColor: brandColor }}
                      />
                    </div>
                  </div>

                  {/* CONTACT METHOD BLOCK — label + radios + helper as one unit */}
                  <div className="contact-method-block flex flex-col space-y-2">
                    <span className="block text-sm font-medium text-gray-700">How would you like to be contacted? *</span>
                    <div className="flex gap-4" role="radiogroup" aria-required="true" aria-label="Preferred contact method">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="report-lead-contact"
                          value="call"
                          checked={preferredContact === "call"}
                          onChange={() => setPreferredContact("call")}
                          className="rounded-full border-gray-300 text-gray-900 focus:ring-2 focus:ring-offset-0"
                          style={{ accentColor: brandColor }}
                        />
                        <span className="text-sm text-gray-700">Call</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="report-lead-contact"
                          value="email"
                          checked={preferredContact === "email"}
                          onChange={() => setPreferredContact("email")}
                          className="rounded-full border-gray-300 text-gray-900 focus:ring-2 focus:ring-offset-0"
                          style={{ accentColor: brandColor }}
                        />
                        <span className="text-sm text-gray-700">Email</span>
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 leading-snug">Your installer will use this to reach you.</p>
                  </div>

                  {/* CONSENT BLOCK — checkbox + legal as its own section */}
                  <div className="consent-block flex items-start gap-3">
                    <input
                      id="report-lead-consent"
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-1 rounded border-gray-300 shrink-0"
                    />
                    <label htmlFor="report-lead-consent" className="text-sm text-gray-600 leading-6">
                      I agree to be contacted by {consentCompany} by phone, email, or text regarding my solar project and next steps.{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Privacy</a>
                      {" · "}
                      <a href="/terms" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">Terms</a>
                    </label>
                  </div>

                  {/* ACTIONS BLOCK — error + submit + cancel as one intentional group */}
                  <div className="actions-block flex flex-col items-center space-y-3">
                    {error && (
                      <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700">{error}</div>
                    )}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary w-full py-3.5 px-4 rounded-xl font-semibold text-white transition-opacity disabled:opacity-70"
                      style={{ ['--brand' as string]: brandColor } as React.CSSProperties}
                    >
                      {isSubmitting ? "Sending…" : "📅 Book your consultation"}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="w-full py-2 text-center text-sm text-gray-500 hover:text-gray-700"
                      aria-label="Cancel"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center" data-testid="report-lead-success">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 text-white text-2xl" style={{ backgroundColor: brandColor }} aria-hidden>✓</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Thanks for submitting</h3>
                <p className="text-gray-600 mb-6">You&apos;re all set. {displayCompany} will reach out within 1–2 business days.</p>
                <div className="space-y-3">
                  {bookingUrl ? (
                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-3 px-4 rounded-xl font-semibold text-white text-center"
                      style={{ backgroundColor: brandColor }}
                      onClick={() => onClose()}
                    >
                      Book a time (recommended)
                    </a>
                  ) : null}
                  <button
                    type="button"
                    onClick={onClose}
                    className="block w-full py-3 px-4 rounded-xl font-semibold text-white"
                    style={{ backgroundColor: brandColor }}
                  >
                    {bookingUrl ? "Back to report" : "Close"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FocusTrap>
    </div>
  );
}
