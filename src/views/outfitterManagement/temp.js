import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CCard,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CAlert,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CForm,
    CFormInput
} from '@coreui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const OutfitterManagement = () => {
    const [visible, setVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedOutfitter, setSelectedOutfitter] = useState(null);
    const [outfitters, setOutfitters] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        description: '',
        address: '',
        animalId: '',
        outfitterName: '',
        password: '',
        image: null
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOutfitters();
    }, []);

    const fetchOutfitters = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/outfitter/getAll');
            const populatedOutfitters = await Promise.all(response.data.data.map(async (outfitter) => {
                const animalResponse = await axios.get(`http://localhost:3002/api/animal/${outfitter.animalId}`);
                const animalName = animalResponse.data.name; // Assuming your animal API endpoint returns name
                return { ...outfitter, animalName };
            }));
            setOutfitters(populatedOutfitters);
        } catch (error) {
            setError('Error fetching outfitters');
            console.error('Error fetching outfitters:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/api/outfitter/deleteOutfitter/${id}`);
            setOutfitters(outfitters.filter(outfitter => outfitter._id !== id));
        } catch (error) {
            setError('Error deleting outfitter');
            console.error('Error deleting outfitter:', error);
        }
    };

    const handleEdit = (outfitter) => {
        setSelectedOutfitter(outfitter);
        setFormData({
            name: outfitter.name || '',
            email: outfitter.email || '',
            mobileNumber: outfitter.mobileNumber || '',
            description: outfitter.description || '',
            address: outfitter.address || '',
            animalId: outfitter.animalId || '',
            outfitterName: outfitter.outfitterName || '',
            password: outfitter.password || '',
            image: outfitter.image || null
        });
        setEditVisible(true);
    };

    const handleEditOutfitter = async (event) => {
        event.preventDefault();
        const { _id } = selectedOutfitter;
        try {
            await axios.put(`http://localhost:3002/api/outfitter/updateOutfitter/${_id}`, formData);
            setEditVisible(false);
            await fetchOutfitters();
        } catch (error) {
            setError('Error updating outfitter');
            console.error('Error updating outfitter:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    return (
        <>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CCard>
                <CCardHeader>
                    <CRow className="align-items-center">
                        <CCol>
                            <div style={{ fontSize: '1rem' }}>
                                Outfitter Management
                            </div>
                        </CCol>
                    </CRow>
                </CCardHeader>

                <CTable responsive striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Outfitter Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Mobile Number</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Address</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Animal Name</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {outfitters.map((outfitter, index) => (
                            <CTableRow key={outfitter._id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell>{outfitter.name || 'null'}</CTableDataCell>
                                <CTableDataCell>{outfitter.outfitterName || 'null'}</CTableDataCell>
                                <CTableDataCell>{outfitter.email || 'null'}</CTableDataCell>
                                <CTableDataCell>{outfitter.mobileNumber || 'null'}</CTableDataCell>
                                <CTableDataCell>{outfitter.address ? `${outfitter.address.street}, ${outfitter.address.city}, ${outfitter.address.state}, ${outfitter.address.zipCode}` : 'null'}</CTableDataCell>
                                <CTableDataCell>{outfitter.animalName || 'null'}</CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CButton className="me-1 p-1" onClick={() => handleDelete(outfitter._id)}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: "#fd2b2b" }} />
                                    </CButton>
                                    <CButton className="p-1" onClick={() => handleEdit(outfitter)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCard>

            {/* Modal for editing outfitter */}
            <CModal visible={editVisible} onClose={() => setEditVisible(false)}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Outfitter</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm onSubmit={handleEditOutfitter}>
                        <CFormInput id="name" value={formData.name} onChange={handleChange} />
                        <CFormInput id="outfitterName" value={formData.outfitterName} onChange={handleChange} />
                        <CFormInput id="email" value={formData.email} onChange={handleChange} />
                        <CFormInput id="mobileNumber" value={formData.mobileNumber} onChange={handleChange} />
                        <CFormInput id="address" value={formData.address} onChange={handleChange} />
                        <CFormInput id="animalId" value={formData.animalId} onChange={handleChange} />
                        <CFormInput id="description" value={formData.description} onChange={handleChange} />
                        <CFormInput id="password" value={formData.password} onChange={handleChange} />
                        <CButton type="submit">Save Changes</CButton>
                    </CForm>
                </CModalBody>
            </CModal>
        </>
    );
};

export default OutfitterManagement;
