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
    CButtonGroup,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CAlert
} from '@coreui/react';

// Import necessary Font Awesome components and icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faEye } from '@fortawesome/free-solid-svg-icons';

const AnimalManagement = () => {
    const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [addSpeciesVisible, setAddSpeciesVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [formData, setFormData] = useState({ name: '', image: null });
    const [speciesData, setSpeciesData] = useState({ name: '', image: null, description: '' }); // Include description in state
    const [species, setSpecies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/animals/getAnimal');
            setAnimals(response.data.data);
        } catch (error) {
            setError('Error fetching animals');
            console.error('Error fetching animals:', error);
        }
    };

    const handleView = async (animal) => {
        try {
            const response = await axios.get(`http://localhost:3002/api/animals/getSpecie/${animal._id}`);
            console.log(response.data.data);
            
            setSpecies(response.data.data);
            setSelectedAnimal(animal);
            setVisible(true);
        } catch (error) {
            setError('Error fetching species');
            console.error('Error fetching species:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/api/animals/deleteAnimals/${id}`);
            setAnimals(animals.filter(animal => animal._id !== id));
        } catch (error) {
            setError('Error deleting animal');
            console.error('Error deleting animal:', error);
        }
    };

    const deleteSpecies = async (animalId, id) => {
        try {
            await axios.delete(`http://localhost:3002/api/animals/deleteSpecies/${animalId}/${id}`);
            setAnimals(animals.filter(animal => animal._id !== id));
        } catch (error) {
            setError('Error deleting animal');
            console.error('Error deleting animal:', error);
        }
    };


    const handleAddAnimal = async (event) => {
        event.preventDefault();
        try {
            const formDataToSubmit = {
                name: formData.name,
            };
            const response = await axios.post('http://localhost:3002/api/animals/addAnimal', formDataToSubmit);
            setFormVisible(false);
            resetFormData();
            fetchAnimals();
        } catch (error) {
            setError('Error adding animal');
            console.error('Error adding animal:', error);
        }
    };

    const handleAddSpecies = async (event) => {
        event.preventDefault();
        try {
            const imageUrl = await uploadImageToCloudinary(speciesData.image);
            const formDataToSubmit = {
                specieName: speciesData.name,
                specieImage: imageUrl,
                description: speciesData.description,
                animalId: selectedAnimal._id
            };
            const response = await axios.post('http://localhost:3002/api/animals/addSpecies', formDataToSubmit);
            setAddSpeciesVisible(false);
            resetSpeciesData();
            fetchAnimals();
        } catch (error) {
            setError('Error adding species');
            console.error('Error adding species:', error);
        }
    };

    const handleEdit = (animal) => {
        setSelectedAnimal(animal);
        setFormData({
            name: animal.name || '',
            area: animal.area || '',
            category: animal.category || '',
            image: animal.image || '',
            moreImages: animal.moreImages || [],
            description: animal.description || '',
            quantity: animal.quantity || 1,
            outfitterId: animal.outfitterId || '',
        });
        setEditVisible(true);
    };

    const handleEditAnimal = async (event) => {
        event.preventDefault();
        const { _id } = selectedAnimal;
        try {
            await axios.put(`http://localhost:3002/api/animals/updateAnimal/${_id}`, formData);
            setEditVisible(false);
            resetFormData();
            fetchAnimals();
        } catch (error) {
            setError('Error updating animal');
            console.error('Error updating animal:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSpeciesChange = (e) => {
        const { id, value } = e.target;
        setSpeciesData({
            ...speciesData,
            [id]: value,
        });
    };

    const resetFormData = () => {
        setFormData({
            name: '',
            area: '',
            category: '',
            image: '',
            moreImages: [],
            description: '',
            quantity: 1,
            outfitterId: '',
        });
    };

    const resetSpeciesData = (animal) => {
        setSpeciesData({
            name: '',
            image: null,
            description: '', // Reset description field
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFormData({
            ...formData,
            image: file,
        });
    };

    const handleSpeciesFileChange = (e) => {
        const file = e.target.files[0];
        setSpeciesData({
            ...speciesData,
            image: file,
        });
    };

    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        const CLOUDINARY_UPLOAD_PRESET = 'blog_app';
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('cloud_name', 'dm1piteis');
        try {
            const response = await axios.post(`https://api.cloudinary.com/v1_1/dqhh1rff5/image/upload`, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            throw new Error('Error uploading image to Cloudinary');
        }
    };

    return (
        <>
            {error && <CAlert color="danger">{error}</CAlert>}
            <CCard>
                <CCardHeader>
                    <CRow className="align-items-center">
                        <CCol>
                            <div style={{ fontSize: '1rem' }}>
                                Animal Management
                            </div>
                        </CCol>
                        <CCol xs="auto" className="px-4">
                            <CButton color="primary" className="px-4" onClick={() => setFormVisible(true)}>Add Animal</CButton>
                        </CCol>
                    </CRow>
                </CCardHeader>

                <CTable responsive striped hover>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell scope="col">#</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Animal Name</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Species Count</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {animals.map((animal, index) => (
                            <CTableRow key={animal._id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal.name}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal.subcategories.length || 0}</CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CButton className="p-1" onClick={() => handleView(animal)}><FontAwesomeIcon icon={faEye} /></CButton>
                                    <CButton className="me-1 p-1" onClick={() => handleDelete(animal._id)}><FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: "#fd2b2b" }}
                                    /></CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCard>

            <CModal visible={formVisible} onClose={() => { setFormVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Animal</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddAnimal}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CButton color="primary" type="submit">Submit</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => { setFormVisible(false); resetFormData(); }}>Close</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={addSpeciesVisible} onClose={() => { setAddSpeciesVisible(false); resetSpeciesData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Add Species</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleAddSpecies}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={speciesData.name} onChange={handleSpeciesChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="file" id="image" label="Image" onChange={handleSpeciesFileChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput type="textarea" id="description" label="Description" value={speciesData.description} onChange={handleSpeciesChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CButton color="primary" type="submit">Submit</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => { setAddSpeciesVisible(false); resetSpeciesData(); }}>Close</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={editVisible} onClose={() => { setEditVisible(false); resetFormData(); }}>
                <CModalHeader closeButton>
                    <CModalTitle>Edit Animal</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm className="row g-3" onSubmit={handleEditAnimal}>
                        <CCol md={6}>
                            <CFormInput type="text" id="name" label="Name" value={formData.name} onChange={handleChange} />
                        </CCol>
                        <CCol md={6}>
                            <CFormInput type="text" id="category" label="Category" value={formData.category} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput id="area" label="Area" value={formData.area} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput type="textarea" id="description" label="Description" value={formData.description} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CFormInput type="number" id="quantity" label="Quantity" value={formData.quantity} onChange={handleChange} />
                        </CCol>
                        <CCol xs={12}>
                            <CButton color="primary" type="submit">Update</CButton>
                        </CCol>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => { setEditVisible(false); resetFormData(); }}>Close</CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={visible} onClose={() => setVisible(false)} size='lg'>
                <CModalHeader closeButton>
                    <CModalTitle>Animal Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CListGroup flush>
                        <CCard>
                            <CCardHeader>
                                <CRow className="align-items-center">
                                    <CCol>
                                        <div style={{ fontSize: '1rem' }}>
                                            Subcategory
                                        </div>
                                    </CCol>
                                    <CCol xs="auto" className="px-4">
                                        <CButton color="primary" className="px-4" onClick={() => {setAddSpeciesVisible(true); setVisible(false);}}>Add Species</CButton>
                                    </CCol>
                                </CRow>
                            </CCardHeader>

                            <CTable responsive striped hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Species Name</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Image Count</CTableHeaderCell>
                                        <CTableHeaderCell className="text-center" scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {species?.map((animal, index) => (
                                        <CTableRow key={index}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal?.spiceName}</CTableDataCell>
                                            <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal?.spiceImage?.length || 0}</CTableDataCell>
                                            <CTableDataCell className="text-center">
                                                <img src={animal?.spiceImage} alt={animal?.spiceName} width="150" />
                                            </CTableDataCell>
                                            <CTableDataCell>
                                                <CButton className="me-1 p-1" onClick={() => deleteSpecies(selectedAnimal?._id, animal?.specieID)}>
                                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#fd2b2b" }} />
                                                </CButton>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCard>
                    </CListGroup>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setVisible(false)}>Close</CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default AnimalManagement;
