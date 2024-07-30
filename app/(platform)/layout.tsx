import { Toaster } from "sonner";
import { ClerkProvider } from "@clerk/nextjs";

import { ModalProvider } from "@/components/providers/modal-provider";
import { QueryProvider } from "@/components/providers/query-provider";

const PlatformLayout = ({
    children
}:{
    children: React.ReactNode;
}) => {
    return (
      <div>
        <ClerkProvider>
          <QueryProvider>
          <Toaster />
          <ModalProvider />
            {children}
          </QueryProvider>  
        </ClerkProvider>
      </div>
    );
};

export default PlatformLayout;