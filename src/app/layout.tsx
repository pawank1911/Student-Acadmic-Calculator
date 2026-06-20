import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "Student Academic Calculator | Attendance & CGPA Tools",
  description:
    "Free academic tools for engineering students. Calculate how many classes you can skip or need to attend, and find the SGPA required to hit your CGPA target.",
  keywords: [
    "student calculator",
    "attendance calculator",
    "CGPA calculator",
    "SGPA calculator",
    "engineering student tools",
    "academic planner",
  ],
  authors: [{ name: "Pawan Saw", url: "https://github.com/pawank1911" }],
  openGraph: {
    title: "Student Academic Calculator",
    description:
      "Simple tools for engineering students to manage attendance and CGPA targets.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Academic Calculator",
    description:
      "Simple tools for engineering students to manage attendance and CGPA targets.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('sac_theme');
                  if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
