import "./App.css";
import TicketCreateForm from "./components/TicketCreateForm";
import TicketDetail from "./components/TicketDetail";
import TicketList from "./components/TicketList";

function App() {
    return (
        <div className="page">
            <h1>Adesk Ticket UI</h1>
            <div className="grid">
                <div className="col card">
                    <h2>Ticket List</h2>
                    <TicketList></TicketList>
                </div>
                <div className="col card">
                    <h2>Create Ticket</h2>
                    <TicketCreateForm></TicketCreateForm>
                    <div>
                        <h2>Details / Update</h2>
                        <TicketDetail
                            ticketId={"4db732a9-24c9-49b7-8afb-3c9ae8cd5bf0"}
                        ></TicketDetail>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
