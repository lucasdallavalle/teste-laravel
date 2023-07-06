import ReactDOM from 'react-dom/client';

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { maskDocument } from "../mask.js"

function DetailEvent() {
    // Listagem
    const [participants, setParticipants] = useState([]);
    const [activeTab, setActiveTab] = useState('eventInfo');
    const [tabModal, setTabModal] = useState('edit');

    // Evento
    const id = (window.location.pathname).split('/').slice(-1).pop();
    const [name, setName] = useState('');
    const [dateStart, setStartDate] = useState('');
    const [dateEnd, setEndDate] = useState('');


    // Modal Participante
    const [showModal, setShowModal] = useState(false);
    const [idParticipant, setIdParticipant] = useState(0);
    const [nameParticipant, setNameParticipant] = useState('');
    const [documentParticipant, setDocumentParticipant] = useState('');
    const [emailParticipant, setEmailParticipant] = useState('');

    // Presence
    const [presences, setPresences] = useState([]);
    const [date, setDate] = useState('');

    useEffect(()=>{
        fetchEvent();
    }, [] );


    // EVENTO
    const fetchEvent = async () => {
        await axios.get(`http://localhost:8000/api/events/${id}`).then(({data})=>{
            if(data) {
                setName(data.event.name);
                setStartDate(data.event.dateStart);
                setEndDate(data.event.dateEnd);
            }
        })
    }
    const addEvent = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        let url = "";
        if(id > 0) {
            formData.append('_method', 'PATCH');
            formData.append('id', id);
            url += `${id}`
        }
        formData.append('name', name);
        formData.append('dateStart', dateStart);
        formData.append('dateEnd', dateEnd);
    
        await axios.post(`http://localhost:8000/api/events/${url}` , formData).then(({data}) => {
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchEvent();
            fetchParticipants();
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

    // Participantes
    const fetchParticipants = async () => {
        let filtros = { params: { idEvent : id } };
        await axios.get(`http://localhost:8000/api/participants`, filtros).then(({data})=>{
            if(data)
                setParticipants(data)
        })
    }
    const handleEdit = async (event) => {
        setIdParticipant(event.id)
        setNameParticipant(event.name);
        setDocumentParticipant(event.document);
        setEmailParticipant(event.email);
        setShowModal(true);
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

        await axios.delete(`http://localhost:8000/api/participants/${id}`).then(({data})=>{
            fetchParticipants()
        }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
        })
    }
    const handleNameParticipant = (e) => {
        setNameParticipant(e.target.value);
    }
    const handleDocumentParticipant = (e) => {
        setDocumentParticipant(maskDocument(e.target.value))
    }
    const handleEmailParticipant = (e) => {
        setEmailParticipant(e.target.value);
    }
    const addParticipant = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        let url = "";
        if(idParticipant > 0) {
            formData.append('_method', 'PATCH');
            formData.append('id', idParticipant);
            url += `${idParticipant}`
        }
        formData.append('name', nameParticipant);
        formData.append('document', documentParticipant);
        formData.append('email', emailParticipant);
        formData.append('idEvent', id);

    
        await axios.post(`http://localhost:8000/api/participants/${url}` , formData).then(({data}) => {
            Swal.fire({
                icon:"success",
                text:data.message
            })
            setNameParticipant('');
            setDocumentParticipant('');
            setEmailParticipant('');
            setShowModal(false);
            fetchParticipants();
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
    const handleCloseModal = () => {
        setIdParticipant(0);
        setNameParticipant('');
        setDocumentParticipant('');
        setEmailParticipant('');
        setShowModal(false);
        fetchParticipants()
    }

    // Presence
    const fetchPresence = async () => {
        let filtros = { params: { idParticipant : idParticipant } };
        await axios.get(`http://localhost:8000/api/presence`, filtros).then(({data})=>{
            if(data)
                setPresences(data)
        })
    }
    const addPresence = async (e) => {
        e.preventDefault();
        const formData = new FormData()
        formData.append('data', date);
        formData.append('idParticipant', idParticipant);
    
        await axios.post(`http://localhost:8000/api/presence` , formData).then(({data}) => {
            Swal.fire({
                icon:"success",
                text:data.message
            })
            fetchPresence();
        }).catch(({response}) => {
            Swal.fire({
                text:response.data.message,
                icon:"error"
            })
        })
    }
    const handleDatePresence = (e) => {
        if(e.target.value >= dateStart && e.target.value <= dateEnd){
            setDate(e.target.value);
        } else {
            Swal.fire({
                icon: "warning",
                text: "Data selecionada fora da data do evento"
            })
        }
    };
    const deletePresence = async (id) => {
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

        await axios.delete(`http://localhost:8000/api/presence/${id}`).then(({data})=>{
            fetchPresence()
        }).catch(({response:{data}})=>{
            Swal.fire({
                text:data.message,
                icon:"error"
            })
        })
    }
    
    return (
        <>
        <div className="card">
            <div className="card-header px-4 py-3 d-flex flex-nowrap justify-content-between">
                <h2>Evento: {name} </h2>
            </div>
            <ul className="nav nav-tabs mt-3">
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'eventInfo' ? 'active' : ''}`} onClick={() => setActiveTab('eventInfo')}>
                        Dados do Evento
                    </a>
                </li>
                <li className="nav-item">
                    <a className={`nav-link ${activeTab === 'participantList' ? 'active' : ''}`} onClick={() => {fetchParticipants(); setActiveTab('participantList'); }}>
                        Participantes
                    </a>
                </li>
            </ul>

            {activeTab === 'eventInfo' && (
                <div className='px-4 py-3'>
                    <form onSubmit={addEvent} className='d-grid px-4 pt-3 pb-4' style={{gap:'15px', gridTemplateColumns: 'repeat(1, 1fr)'}}>
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
                        <div className="form-group d-flex justify-content-between">
                            <button type="submit" className="btn btn-primary">
                                Salvar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {activeTab === 'participantList' && (
                <div className='px-4 py-3'>
                    <h2>Lista de Eventos</h2>
                    <button type="button" className="btn btn-primary" onClick={() => {setTabModal("edit"); setShowModal(true)}}>
                        Cadastrar Participante
                    </button>

                    <div className='d-grid py-3'>
                        {participants.length === 0 ? (
                            <p>Nenhum participante ainda.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                    <th>Nome</th>
                                    <th>CPF</th>
                                    <th>E-mail</th>
                                    <th>% Participação</th>
                                    <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participants.map((participant, index) => (
                                        <tr key={index}>
                                        <td>{participant.name}</td>
                                        <td>{participant.document}</td>
                                        <td>{participant.email}</td>
                                        <td>
                                            {Math.round(participant.presence.length / ((new Date(dateEnd) - new Date(dateStart)) / (1000 * 60 * 60 * 24) + 1) * 100)}%
                                        </td>
                                        <td>
                                        <button
                                            className="btn btn-secondary btn-sm"
                                            onClick={() => handleEdit(participant)}>
                                            Editar
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(participant.id)}
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
            )}

            <div className="modal" id="myModal" tabIndex="-1" role="dialog" style={{ display: showModal ? "block" : "none" }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{idParticipant ? 'Editar' : 'Cadastrar'} Participante</h5>
                            <button
                                type="button"
                                className="btn btn-secondary close"
                                onClick={() => { handleCloseModal()}}
                            >
                                <span>&times;</span>
                            </button>
                        </div>
                        <div>
                            <ul className="nav nav-tabs mt-3">
                                <li className="nav-item">
                                    <a className={`nav-link ${tabModal === 'edit' ? 'active' : ''}`} onClick={() => setTabModal('edit')}>
                                        Dados do Paticipante
                                    </a>
                                </li>
                                { idParticipant != 0 && (
                                    <li className="nav-item">
                                        <a className={`nav-link ${tabModal === 'presence' ? 'active' : ''}`} onClick={() => {fetchPresence(); setTabModal('presence'); }}>
                                            Presença
                                        </a>
                                    </li>
                                )}
                            </ul>
                            {tabModal === 'edit' && (
                                <form onSubmit={addParticipant} className='d-grid px-4 pt-3 pb-4' style={{gap:'15px', gridTemplateColumns: 'repeat(1, 1fr)'}}>
                                    <div className="form-group">
                                        <label htmlFor="nameParticipant">Nome</label>
                                        <input
                                            type="text"
                                            id="nameParticipant"
                                            className="form-control"
                                            value={nameParticipant}
                                            onChange={handleNameParticipant}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="documentParticipant">CPF</label>
                                        <input
                                            type="text"
                                            id="documentParticipant"
                                            className="form-control"
                                            maxLength={18}
                                            value={documentParticipant}
                                            onChange={handleDocumentParticipant}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="emailParticipant">Email</label>
                                        <input
                                            type="email"
                                            id="emailParticipant"
                                            className="form-control"
                                            value={emailParticipant}
                                            onChange={handleEmailParticipant}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <button type="submit" className="btn btn-primary">
                                            Salvar
                                        </button>
                                    </div>
                                </form>
                            )}
                            {tabModal === 'presence' && (
                                <div className='px-4 pt-3'>
                                    <form onSubmit={addPresence} className='d-flex flex-wrap aling-items-center pt-3 pb-4'>
                                        <div className="form-group col-8">
                                            <label htmlFor="dateEnd">Data de Fim</label>
                                            <input
                                                type="date"
                                                id="dateEnd"
                                                min={dateStart}
                                                max={dateEnd}
                                                className="form-control"
                                                value={date}
                                                onChange={handleDatePresence}
                                            />
                                        </div>
                                        <div className="form-group col-4 text-left py-3 mb-0">
                                            <button type="submit" className="mb-0 btn btn-primary">
                                                Salvar
                                            </button>
                                        </div>
                                    </form>
                                    { presences.length === 0 ? (
                                        <p>Nenhuma presença confirmada.</p>
                                    ) : (
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                <th>Data</th>
                                                <th>Ações</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {presences.map((presence, index) => (
                                                    <tr key={index}>
                                                        <td>{presence.data}</td>
                                                        <td>
                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() => deletePresence(presence.id)}
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
                            )}
                        </div>
                        
                    </div>
                </div>
            </div>

            <div className="card-footer px-4 py-3">
                <a href='../' className="btn btn-secondary">
                    Voltar
                </a>
            </div>
            
        </div>
    </>
    );
}

export default DetailEvent;

if (document.getElementById('DetailEvent')) {
    const Index = ReactDOM.createRoot(document.getElementById("DetailEvent"));
    
    Index.render(
        <React.StrictMode>
            <DetailEvent/>
        </React.StrictMode>
    )
}
