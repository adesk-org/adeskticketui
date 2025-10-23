import {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import TicketModal from "./TicketModal";

type TicketModalContextValue = {
    open: (ticketId: string) => void;
    close: () => void;
};

const TicketModalContext = createContext<TicketModalContextValue | null>(null);

export function TicketModalProvider({ children }: { children: ReactNode }) {
    const [ticketId, setTicketId] = useState<string | null>(null);

    const open = useCallback((id: string) => {
        setTicketId(id);
    }, []);

    const close = useCallback(() => {
        setTicketId(null);
    }, []);

    const value = useMemo(
        () => ({
            open,
            close,
        }),
        [open, close],
    );

    return (
        <TicketModalContext.Provider value={value}>
            {children}
            {ticketId && (
                <TicketModal ticketId={ticketId} onRequestClose={close} />
            )}
        </TicketModalContext.Provider>
    );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTicketModal() {
    const ctx = useContext(TicketModalContext);
    if (!ctx) {
        throw new Error(
            "useTicketModal must be used within a TicketModalProvider",
        );
    }
    return ctx;
}
