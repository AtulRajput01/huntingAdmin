import React from 'react';
import {
    CButton,
    CCol,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHeaderCell,
    CTableHead,
    CTableRow,
    CListGroup,
    CListGroupItem,
} from '@coreui/react';

const AnimalDetailsModal = ({ visible, onClose, animal }) => {
    // const [visible, setVisible] = useState(false);
    const [formVisible, setFormVisible] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [selectedAnimal, setSelectedAnimal] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        area: '',
        category: '',
        image: '',
        moreImages: [],
        description: '',
        quantity: 1,
        outfitterId: '',
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchAnimals();
    }, []);

    const fetchAnimals = async () => {
        try {
            const response = await axios.get('http://localhost:3002/api/animals/getAllAnimals');
            setAnimals(response.data.data);
        } catch (error) {
            setError('Error fetching animals');
            console.error('Error fetching animals:', error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3002/api/animals/${id}`);
            setAnimals(animals.filter(animal => animal._id !== id));
        } catch (error) {
            setError('Error deleting animal');
            console.error('Error deleting animal:', error);
        }
    };

    const handleAddAnimal = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:3002/api/animals/registerAnimal', formData);
            setFormVisible(false);
            resetFormData();
            fetchAnimals(); // Re-fetch animals after adding a new animal
        } catch (error) {
            setError('Error adding animal');
            console.error('Error adding animal:', error);
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
            fetchAnimals(); // Fetch the latest data after updating
        } catch (error) {
            setError('Error updating animal');
            console.error('Error updating animal:', error);
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        if (id === 'quantity') {
            const parsedValue = parseInt(value);
            const validQuantity = isNaN(parsedValue) ? 1 : Math.max(parsedValue, 1);
            setFormData({ ...formData, [id]: validQuantity });
        } else {
            setFormData({ ...formData, [id]: value });
        }
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

    return (
        <CModal visible={visible} onClose={onClose}>
            <CModalHeader onClose={onClose}>
                <CModalTitle>Animal Details</CModalTitle>
            </CModalHeader>
            <CModalBody>
                <CRow>
                    <CCol md={12}>
                        <CListGroup>
                            <CListGroupItem><strong>Name:</strong> {animal.name}</CListGroupItem>
                            <CListGroupItem><strong>Area:</strong> {animal.area}</CListGroupItem>
                            <CListGroupItem><strong>Category:</strong> {animal.category}</CListGroupItem>
                            <CListGroupItem><strong>Image:</strong> <img src={animal.image} alt="Animal" style={{ maxWidth: '100%' }} /></CListGroupItem>
                            <CListGroupItem><strong>Description:</strong> {animal.description}</CListGroupItem>
                            <CListGroupItem><strong>Quantity:</strong> {animal.quantity}</CListGroupItem>
                        </CListGroup>
                    </CCol>
                </CRow>
                {/* {animal.subCategories && animal.subCategories.length > 0 && (
                    <CRow className="mt-3">
                        <CCol md={12}>
                            <h5>Subcategories</h5>
                            <CTable responsive striped hover>
                                <CTableHead>
                                    <CTableRow>
                                        <CTableHeaderCell scope="col">#</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Subcategory Name</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Details</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {animal.subCategories.map((subcategory, index) => (
                                        <CTableRow key={index}>
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{subcategory.name}</CTableDataCell>
                                            <CTableDataCell>{subcategory.details}</CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCol>
                    </CRow>
                )} */}
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
                            <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                            <CTableHeaderCell scope="col">Quantity</CTableHeaderCell>
                            <CTableHeaderCell className="text-center" scope="col">Action</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    <CTableBody>
                        {animals.map((animal, index) => (
                            <CTableRow key={animal._id}>
                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal.name || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal.category || 'null'}</CTableDataCell>
                                <CTableDataCell style={{ fontSize: '0.870rem' }}>{animal.quantity || 'null'}</CTableDataCell>
                                <CTableDataCell className="text-center">
                                    <CButton className="me-1 p-1" onClick={() => handleEdit(animal)}> <FontAwesomeIcon icon={faEdit} /></CButton>
                                    <CButton className="me-1 p-1" onClick={() => handleDelete(animal._id)}><FontAwesomeIcon
                                        icon={faTrash}
                                        style={{ color: "#fd2b2b" }}
                                    /></CButton>
                                    <CButton className="p-1" onClick={() => { setSelectedAnimal(animal); setVisible(true); }}><FontAwesomeIcon icon={faEye} /></CButton>
                                </CTableDataCell>
                            </CTableRow>
                        ))}
                    </CTableBody>
                </CTable>
            </CCard>
            </CModalBody>
            <CModalFooter>
                <CButton color="secondary" onClick={onClose}>Close</CButton>
            </CModalFooter>
        </CModal>
    );
};

export default AnimalDetailsModal;
