import { useState } from "react";
import "../App.css";
import TicketCreateForm from "../components/TicketCreateForm";
import TicketDetail from "../components/TicketDetail";
import TicketList from "../components/TicketList";

export default function TicketPage() {
    const [openedId, setOpenedId] = useState<string | null>(null);

    return (
        <div className="page">
            <h1>Adesk Ticket UI</h1>
            <div className="grid">
                <div className="col card">
                    <h2>Ticket List</h2>
                    <TicketList onOpened={setOpenedId}></TicketList>
                </div>
                <div className="col stack">
                    <div className="card">
                        <h2>Create Ticket</h2>
                        <TicketCreateForm></TicketCreateForm>
                    </div>
                    <div className="card">
                        <h2>Update</h2>
                        <TicketDetail ticketId={openedId}></TicketDetail>
                    </div>
                </div>
            </div>
        </div>
    );
}
