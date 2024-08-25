import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [form, setForm] = useState({ id: null, categoryName: '', isStatus: '' });
  const [isEditing, setIsEditing] = useState(false);


  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/category');
      setActivities(response.data.getCategories);
      fetchActivities();
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch activities');
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        id: form.id,
        categoryName: form.categoryName,
        isStatus: form.isStatus,
      };

      if (isEditing) {
        console.log('Updating activity with ID:', form.id);
        const response = await axios.put(`http://localhost:4000/api/category/update/${form.id}`, payload);
        console.log('Update response:', response.data);
        setActivities(activities.map(activity => activity._id === form.id ? response.data : activity));
        setIsEditing(false);
        toast.success(response.data.message || 'Activity updated successfully');
      } else {
        const response = await axios.post('http://localhost:4000/api/category/create', payload);
        setActivities([...activities, response.data]);
        toast.success(response.data.message || 'Activity created successfully');
      }

      // Resetting form state
      setForm({ id: null, categoryName: '', isStatus: '' });
    } catch (error) {
      console.error('Error details:', error.response ? error.response.data : error.message);
      toast.error(error.response?.data?.message || 'Failed to save activity');
    }
  };


  const handleEdit = (activity) => {
    setForm({ id: activity._id, categoryName: activity.categoryName, isStatus: activity.isStatus });
    setIsEditing(true);
  };


  const handleDelete = async (id) => {
    try {
      const response = await axios.delete('http://localhost:4000/api/category/delete', {
        data: { id }  // Sending ID in the request body
      });
      toast.success(response.data.message || 'Activity deleted successfully');
      fetchActivities();
    } catch (error) {
      console.error('Delete error:', error.response?.data);
      toast.error(error.response?.data?.message || 'Failed to delete activity');
    }
  };


  return (
    <Container maxWidth="md" className="py-8">
      <Typography
        variant="h4"
        gutterBottom
        style={{ marginTop: '30px', textAlign: 'center' }}
      >
        Activities
      </Typography>

      <form onSubmit={handleSubmit} className="mb-4 flex space-x-2">
        <TextField
          name="categoryName"
          value={form.categoryName}
          onChange={handleChange}
          placeholder="Category Name"
          required
          variant="outlined"
          fullWidth
        />
        <TextField
          name="isStatus"
          value={form.isStatus}
          onChange={handleChange}
          placeholder="Status"
          required
          variant="outlined"
          fullWidth
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ height: '100%' }}
        >
          {isEditing ? 'Update' : 'Create'} Activity
        </Button>
      </form>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Category Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(activity => (
              <TableRow key={activity._id}>
                <TableCell>{activity.categoryName}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(activity)}
                    variant="contained"
                    color="primary"
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(activity._id)}
                    variant="contained"
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <ToastContainer />
    </Container>
  );
};

export default Activities;
