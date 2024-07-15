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
      setActivities(response.data.getCategories); // Accessing the actual data
    } catch (error) {
      console.error(error);
    }
  };


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        const response = await axios.put(`http://localhost:4000/api/category/update/${form.id}`, form);
        setActivities(activities.map(activity => activity.id === form.id ? response.data : activity));
        setIsEditing(false);
      } else {
        const response = await axios.post('http://localhost:4000/api/category/create', form);
        setActivities([...activities, response.data]);
      }
      setForm({ id: null, categoryName: '', isStatus: '' });
    } catch (error) {
      console.error(error);
    }
  };

  const handleEdit = (activity) => {
    setIsEditing(true);
    setForm(activity);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/category/delete/${id}`);
      setActivities(activities.filter(activity => activity.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Container maxWidth="md" className="py-4">
      <Typography variant="h4" gutterBottom>
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
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {activities.map(activity => (
              <TableRow key={activity.id}>
                <TableCell>{activity.categoryName}</TableCell>
                <TableCell>{activity.isStatus}</TableCell>
                <TableCell>
                  <Button
                    onClick={() => handleEdit(activity)}
                    variant="contained"
                    color="secondary"
                    style={{ marginRight: '8px' }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDelete(activity.id)}
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
    </Container>
  );
};

export default Activities;
