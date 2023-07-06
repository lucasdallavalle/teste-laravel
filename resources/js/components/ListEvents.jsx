import ReactDOM from 'react-dom/client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


function ListEvents() {
    const [events, setEvents] = useState([]);
    const [idEvent, setIdEvent] = useState(0);

    const [name, setName] = useState('');
    const [dateStart, setStartDate] = useState('');
    const [dateEnd, setEndDate] = useState('');
    const [showModal, setShowModal] = useState(false);

    const [filterName, setFilterName] = useState('');
    const [filterDateStart, setFilterStartDate] = useState('');
    const [filterDateEnd, setFilterEndDate] = useState('');

    useEffect(()=>{
        fetchEvents() 
    },[])
    const fetchEvents = async () => {
        let filtros = { params: { } };
        if(filterName) {
            filtros.params.name = filterName;
        }
        if(filterDateStart) {
            filtros.params.dateStart = filterDateStart;
        }
        if(filterDateEnd) {
            filtros.params.dateEnd = filterDateEnd;
        }
        await axios.get(`http://localhost:8000/api/events`, filtros).then(({data})=>{
            setEvents(data)
        })
    }
    const handleEdit = async (event) => {
        setIdEvent(event.id);
        setName(event.name);
        setStartDate(event.dateStart);
        setEndDate(event.dateEnd);        
        setShowModal(true)
    }
    const handleDelete = async (id) => {
        const isConfirm = await Swal.fire({
            title: 'Você tem certeza?',
            text: "Esta ação não pode ser revertida!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Excluir!'
        }).then((result) => {
            return result.isConfirmed
        });

          if(!isConfirm){
            return;
          }

          await axios.delete(`http://localhost:8000/api/events/${id}`).then(({data})=>{
            fetchEvents()
          }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
          })
    }
    const createEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        let url = "";
        if(idEvent > 0) {
            formData.append('_method', 'PATCH');
            formData.append('id', idEvent);
            url += `${idEvent}`
        }
        formData.append('name', name);
        formData.append('dateStart', dateStart);
        formData.append('dateEnd', dateEnd);
    
        await axios.post(`http://localhost:8000/api/events/${url}` , formData).then(({data}) => {
            Swal.fire({
                icon:"success",
                text:data.message
            })
            // Limpa valores
            setName('');
            setStartDate('');
            setEndDate('');

            setShowModal(false);
            fetchEvents();
        }).catch(({response}) => {
            if(response) {
                switch(response.status) {
                    case 422:
                        setValidationError(response.data.errors)
                        break;
                    default:
                        Swal.fire({
                            text:response.data.message,
                            icon:"error"
                        })
                        break;
                }
            }
        })
    }
    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handleStartDateChange = (e) => {
        if(e.target.value <= dateEnd || !dateEnd){
            setStartDate(e.target.value);
        } else {
            Swal.fire({
                icon:"warning",
                text:"Data Inicial maior que data final"
            })
            e.target.value = dateEnd;
        }
    };
    const handleEndDateChange = (e) => {
        if(e.target.value >= dateStart || !dateStart){
            setEndDate(e.target.value);
        } else {
            Swal.fire({
                icon:"warning",
                text:"Data Final menor que data Inicial"
            })
            e.target.value = dateStart;
        }
    };
    const handleFilterNameChange = (e) => {
        setFilterName(e.target.value);
    };
    const handleFilterStartDateChange = (e) => {
        if(e.target.value <= filterDateEnd || !filterDateEnd){
            setFilterStartDate(e.target.value);
        } else {
            Swal.fire({
                icon:"warning",
                text:"Data Inicial do Filtro maior que data final"
            })
            e.target.value = filterDateEnd;
        }
    };
    const handleFilterEndDateChange = (e) => {
        if(e.target.value >= filterDateStart || !filterDateStart){
            setFilterEndDate(e.target.value);
        } else {
            Swal.fire({
                icon:"warning",
                text:"Data Final do Filtro menor que data Inicial"
            })
            e.target.value = filterDateStart;
        }
    };

    return (
        <>
        <div className="card">
            <div className="card-header px-4 py-3 d-flex flex-nowrap justify-content-between">
                <h2>Eventos</h2>
                <button type="button" className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Cadastrar novo Evento
                </button>
            </div>
            <form onSubmit={fetchEvents} className='d-grid px-4 py-3' style={{gap:'15px', gridTemplateColumns: 'repeat(3, 1fr)'}}>
                <div className="form-group">
                    <label htmlFor="filterName">Nome</label>
                    <input
                        type="text"
                        id="filterName"
                        className="form-control"
                        value={filterName}
                        onChange={handleFilterNameChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="filterDateStart">Data de Início</label>
                    <input
                        type="date"
                        id="filterDateStart"
                        className="form-control"
                        value={filterDateStart}
                        onChange={handleFilterStartDateChange}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="filterDateEnd">Data de Fim</label>
                    <input
                        type="date"
                        id="filterDateEnd"
                        className="form-control"
                        value={filterDateEnd}
                        onChange={handleFilterEndDateChange}
                    />
                </div>
                <div className="form-group">
                    <button className="btn btn-primary" type="button" onClick={fetchEvents}>Pesquisar</button>
                </div>
            </form>
            <hr />
            <div className='d-grid px-4 py-3'>
                <h2>Lista de Eventos</h2>
                {events.length === 0 ? (
                    <p>Nenhum evento ainda.</p>
                ) : (
                    <table className="table">
                        <thead>
                            <tr>
                            <th>Título</th>
                            <th>Data de Início</th>
                            <th>Data de Fim</th>
                            <th>Duração</th>
                            <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={index}>
                                <td>{event.name}</td>
                                <td>{event.dateStart}</td>
                                <td>{event.dateEnd}</td>
                                <td>
                                    {((new Date(event.dateEnd) - new Date(event.dateStart)) / (1000 * 60 * 60 * 24)) + 1}
                                    {((new Date(event.dateEnd) - new Date(event.dateStart)) / (1000 * 60 * 60 * 24)) + 1 > 1 ? " dias" : " dia"}</td>
                                <td>
                                <button
                                    className="btn btn-secondary btn-sm"
                                    onClick={() => handleEdit(event)}>
                                    Editar
                                </button>
                                <a
                                    href={"./events/" + event.id}
                                    className="btn btn-primary btn-sm">
                                    Detalhes
                                </a>
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDelete(event.id)}
                                    >
                                    Excluir
                                </button>
                                </td>
                            </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
        <div className="modal" id="myModal" tabIndex="-1" role="dialog" style={{ display: showModal ? "block" : "none" }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                    <h5 className="modal-title">Cadastrar Evento</h5>
                    <button
                        type="button"
                        className="btn btn-secondary close"
                        onClick={() => setShowModal(false)}
                    >
                        <span>&times;</span>
                    </button>
                    </div>
                    <form onSubmit={createEvent} className='d-grid px-4 pt-3 pb-4' style={{gap:'15px', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                        <input
                                type="hidden"
                                id="id"
                                className="form-control"
                                value={idEvent}
                                onChange={setIdEvent}
                            />
                        <div className="form-group">
                            <label htmlFor="name">Título</label>
                            <input
                                type="text"
                                id="name"
                                className="form-control"
                                value={name}
                                onChange={handleNameChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateStart">Data de Início</label>
                            <input
                                type="date"
                                id="dateStart"
                                className="form-control"
                                value={dateStart}
                                onChange={handleStartDateChange}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="dateEnd">Data de Fim</label>
                            <input
                                type="date"
                                id="dateEnd"
                                className="form-control"
                                value={dateEnd}
                                onChange={handleEndDateChange}
                            />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </>
    );
}

export default ListEvents;



if (document.getElementById('example')) {
    const Index = ReactDOM.createRoot(document.getElementById("example"));
    
    Index.render(
        <React.StrictMode>
            <ListEvents/>
        </React.StrictMode>
    )
}
