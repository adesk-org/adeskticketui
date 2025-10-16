import "./App.css";
import TicketList from "./components/TicketList";

function App() {
    return (
        <div className="page">
            <h1>Adesk Ticket UI</h1>
            <div className="grid">
                <h2>Ticket List</h2>
                <TicketList></TicketList>
            </div>
        </div>
    );
}

export default App;
