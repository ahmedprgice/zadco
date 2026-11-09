export const rfqFields = {
  fullName: { label: "Full Name", maxLength: 120 },
  company: { label: "Company Name", maxLength: 160 },
  email: { label: "Email Address", maxLength: 254 },
  phone: { label: "Phone Number", maxLength: 60 },
  enquiryType: { label: "Enquiry Type", maxLength: 40 },
  product: { label: "Products / Equipment of Interest", maxLength: 500 },
  requirements: { label: "Your Message / Requirements", maxLength: 5000 },
} as const

export const rfqEnquiryTypes = ["Request a Quote", "Sourcing Request", "General Enquiry"]
export const rfqAttachmentTypes = [".pdf", ".xlsx", ".png", ".jpg", ".jpeg"]
export const rfqMaxAttachments = 5
export const rfqMaxAttachmentBytes = 4 * 1024 * 1024
