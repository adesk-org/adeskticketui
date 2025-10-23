import "../App.css";
import TicketCreateForm from "../components/TicketCreateForm";
import TicketList from "../components/TicketList";
import { useTicketModal } from "../components/TicketModalContext";

export default function TicketPage() {
    const { open } = useTicketModal();

    return (
        <div className="page">
            <h1>Adesk Ticket UI</h1>
            <div className="grid">
                <div className="col card">
                    <h2>Ticket List</h2>
                    <TicketList onOpened={open}></TicketList>
                </div>
                <div className="col stack">
                    <div className="card">
                        <h2>Create Ticket</h2>
                        <TicketCreateForm></TicketCreateForm>
                    </div>
                </div>
            </div>
        </div>
    );
}
