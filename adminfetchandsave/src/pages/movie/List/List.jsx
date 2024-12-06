import { useNavigate } from 'react-router-dom';
import './List.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Lists = () => {
  const accessToken = localStorage.getItem('accessToken');
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const getMovies = async () => {
    try {
      const response = await axios.get('/movies');
      setLists(response.data);
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = async (id) => {
    const isConfirm = window.confirm(
      'Are you sure that you want to delete this data?'
    );
    if (isConfirm) {
      try {
        await axios.delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // Remove the movie from the list without refetching
        setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
      } catch (error) {
        console.error("Error deleting movie:", error);
      }
    }
  };

  return (
    <div className='lists-container'>
      <div className='create-container'>
        <button
          className='create'
          type='button'
          onClick={() => navigate('/main/movies/form')}
        >
          Create new
        </button>
      </div>
      <div className='table-container'>
        <table className='movie-lists'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map(({ id, title }) => (
              <tr key={id}>
                <td>{id}</td>
                <td className="title-cell">{title}</td> 
                <td>
                  <button
                    className='edit'
                    type='button'
                    onClick={() => navigate(`/main/movies/form/${id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className='delete'
                    type='button'
                    onClick={() => handleDelete(id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
