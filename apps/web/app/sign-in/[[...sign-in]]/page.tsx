import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4 py-10">
      <div className="w-full max-w-md">
        <SignIn
          appearance={{
            variables: {
              colorPrimary: "#000000",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#111827",
              colorText: "#000000",
              colorTextSecondary: "#6b7280",
              borderRadius: "1rem",
              fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'SF Pro Text', sans-serif",
            },
            elements: {
              rootBox: "w-full",
              card: "bg-white border border-gray-200 shadow-xl rounded-3xl p-8",
              headerTitle:
                "text-2xl font-bold tracking-tight text-black mb-2",
              headerSubtitle:
                "text-gray-500 font-medium text-sm mb-6",
              socialButtonsBlockButton:
                "bg-white border border-gray-200 text-black font-bold rounded-full hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm h-12",
              socialButtonsBlockButtonText: "text-black font-bold",
              formButtonPrimary:
                "bg-black text-white font-bold rounded-full hover:bg-gray-800 transition-all h-12 shadow-md hover:shadow-lg",
              formFieldInput:
                "bg-white border border-gray-300 text-black placeholder:text-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary h-12 px-4",
              formFieldLabel:
                "font-bold text-xs uppercase tracking-wide text-gray-700 mb-1.5",
              dividerLine: "bg-gray-200",
              dividerText:
                "font-medium text-xs uppercase tracking-wide text-gray-400 bg-white px-3",
              footerAction__signIn:
                "font-medium text-sm text-gray-600",
              footerActionLink:
                "font-bold text-primary-dark hover:underline underline-offset-4 ml-1",
              identityPreviewText: "text-gray-700 font-medium",
              identityPreviewEditButton:
                "text-primary-dark font-bold text-sm hover:underline ml-2",
              formResendCodeLink:
                "text-primary-dark font-bold text-sm hover:underline",
              alert:
                "bg-red-50 border border-red-100 text-red-800 rounded-xl p-4",
              alertText: "text-red-800 text-sm font-medium",
            },
          }}
        />
      </div>
    </div>
  );
}
