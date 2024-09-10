import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    CCard,
    CCardHeader,
    CCol,
    CRow,
    CButton,
    CListGroup,
    CListGroupItem,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalFooter,
    CModalBody,
    CForm,
    CFormInput,
    CFormSelect,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CAlert
} from '@coreui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const OutfitterManagement = () => {
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedOutfitter, setSelectedOutfitter] = useState(null);
    const [outfitters, setOutfitters] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobileNumber: '',
        description: '',
        address: '',
        animalName: '',
        speciesCount: '',
        outfitterName: '',
        password: '',
        image: null  // Updated to null for file data
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOutfitters();
    }, []);

    const fetchOutfitters = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/outfitter/getAll');
            setOutfitters(response.data.data);
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

    const handleAddOutfitter = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/api/outfitter/create', formData);
            const newOutfitter = response.data.outfitter;
            setOutfitters([...outfitters, newOutfitter]);
            setFormVisible(false);
            resetFormData();
        } catch (error) {
            setError('Error adding outfitter');
            console.error('Error adding outfitter:', error);
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
            animalName: outfitter.animalName || '',
            speciesCount: outfitter.speciesCount || '',
            outfitterName: outfitter.outfitterName || '',
            password: outfitter.password || '',
            image: outfitter.image || null  // Updated to null for file data
        });
        setEditVisible(true);
    };

    const handleEditOutfitter = async (event) => {
        event.preventDefault();
        const { _id } = selectedOutfitter;
        try {
            await axios.put(`http://localhost:3002/api/outfitter/updateOutfitter/${_id}`, formData);
            setEditVisible(false);
            resetFormData();
            await fetchOutfitters();
        } catch (error) {
            setError('Error updating outfitter');
            console.error('Error updating outfitter:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'mobileNumber') {
            const cleanedValue = value.replace(/\D/g, '');
            const prefixedValue = cleanedValue.startsWith('1') ? `+${cleanedValue}` : `+1${cleanedValue}`;
            setFormData({ ...formData, [id]: prefixedValue });
        } else {
            setFormData({ ...formData, [id]: value });
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({ ...formData, image: file });
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            email: '',
            mobileNumber: '',
            description: '',
            address: '',
            animalName: '',
            speciesCount: '',
            outfitterName: '',
            password: '',
            image: null
        });
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
                            {/* <CTableHeaderCell scope="col">Species Count</CTableHeaderCell> */}
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
                                <CTableDataCell>
                                    {outfitter.animal && outfitter.animal.animalName ? outfitter.animal.animalName.name : 'null'}
                                </CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CButton className="me-1 p-1" onClick={() => handleDelete(outfitter._id)}>
                                        <FontAwesomeIcon icon={faTrash} style={{ color: "#fd2b2b" }} />
                                    </CButton>
                                    <CButton className="p-1" onClick={() => { setSelectedOutfitter(outfitter); setVisible(true); }}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>

                </CTable>
            </CCard>

            <CModal visible={formVisible} onClose={() => { setFormVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Outfitter</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddOutfitter}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
                        </CCol>
                        <CCol>
                            <CFormInput type="text" id="animalName" label="Animal Name" value={formData.animalName} onChange={handleChange} />
                        </CCol>
                        {/* <CCol md={6}>
                            <CFormInput type="text" id="speciesCount" label="Species Count" value={formData.speciesCount} onChange={handleChange} />
                        </CCol> */}
                        <CCol md={6}>
                            <CFormInput type="text" id="outfitterName" label="Outfitter Name" value={formData.outfitterName} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="file" id="image" label="Image" onChange={handleFileChange} />
                        </CCol>
                        <CCol className="text-center">
                            <CButton type="submit" color="primary">Add Outfitter</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => { setFormVisible(false); resetFormData(); }}>Cancel</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Outfitter</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleEditOutfitter}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="email" label="Email" value={formData.email} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="mobileNumber" label="Mobile Number" value={formData.mobileNumber} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="animalName" label="Animal Name" value={formData.animalName} onChange={handleChange} />
                        </CCol>
                        {/* <CCol md={6}>
                            <CFormInput type="text" id="speciesCount" label="Species Count" value={formData.speciesCount} onChange={handleChange} />
                        </CCol> */}
                        <CCol md={6}>
                            <CFormInput type="text" id="outfitterName" label="Outfitter Name" value={formData.outfitterName} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="address" label="Address" value={formData.address} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="description" label="Description" value={formData.description} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="password" id="password" label="Password" value={formData.password} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="file" id="image" label="Image" onChange={handleFileChange} />
                        </CCol>
                        <CCol className="text-center">
                            <CButton type="submit" color="primary">Save Changes</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => { setEditVisible(false); resetFormData(); }}>Cancel</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default OutfitterManagement;
