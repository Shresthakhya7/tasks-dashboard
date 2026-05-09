import { LayoutWrapper } from "@/components/layout/layout-wrapper";
import Link from "next/link";

export default function NotFound() {
  return (
    <LayoutWrapper>
      <div className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center px-4 py-12">
        <div className="max-w-md w-full text-center">
          {/* 404 Heading */}
          <h1 className="text-6xl sm:text-7xl font-bold text-foreground mb-4">
            404
          </h1>

          {/* Text Content */}
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            Page not found
          </h2>
          
          <p className="mb-8 text-gray-600">
            Sorry, the page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <span className="inline-flex items-center justify-center w-full px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors cursor-pointer">
                Return to Dashboard
              </span>
            </Link>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
}
