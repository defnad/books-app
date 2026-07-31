import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function AddBookPage({ onAddBook }) {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [year, setYear] = useState('');
  const [cover, setCover] = useState('');

  const isFormValid = title.trim() !== '';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const newBook = {
      title: title.trim(),
      author: author.trim(),
      release_year: year.trim(),
      image: cover.trim(),
      is_taken: false,
    };

    onAddBook(newBook);
    setTitle('');
    setAuthor('');
    setYear('');
    setCover('');
    navigate('/');  // ← переход на главную
  };

  return ( ... ) // остальное без изменений, стили и разметка те же
}