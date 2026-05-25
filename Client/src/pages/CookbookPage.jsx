import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RecipeCard from '../components/RecipeCard';

const CookbookPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRecipes();
  }, [filter]);

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const params = filter === 'saved' ? '?saved=true' : '';
      const res = await axios.get(`/api/recipes${params}`);
      setRecipes(res.data);
    } catch {
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await axios.delete(`/api/recipes/${id}`);
      setRecipes(prev => prev.filter(r => r._id !== id));
      toast.success('Recipe deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  const handleSaveToggle = (updated) => {
    setRecipes(prev => prev.map(r => r._id === updated._id ? updated : r));
  };

  return (
    <div style={s.page}>
      <div style={s.header}>
        <div>
          <h1 style={s.title}>Your Cookbook</h1>
          <p style={s.subtitle}>{recipes.length} recipe{recipes.length !== 1 ? 's' : ''} collected</p>
        </div>
        <div style={s.filters}>
          {['all', 'saved'].map(f => (
            <button
              key={f}
              style={{
                ...s.filterBtn,
                background: filter === f ? 'var(--terracotta)' : 'white',
                color: filter === f ? 'white' : 'var(--brown-mid)'
              }}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? '📚 All' : '🔖 Saved'}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={s.loading}>Loading your recipes...</div>
      ) : recipes.length === 0 ? (
        <div style={s.empty}>
          <p style={{ fontSize: '52px', marginBottom: '12px' }}>📭</p>
          <p style={s.emptyTitle}>
            {filter === 'saved' ? 'No saved recipes yet' : 'No recipes generated yet'}
          </p>
          <p style={s.emptyText}>
            {filter === 'saved' ? 'Bookmark recipes to find them here' : 'Head to Generate to create your first recipe!'}
          </p>
        </div>
      ) : (
        <div style={s.grid}>
          {recipes.map(recipe => (
            <div key={recipe._id} style={s.cardWrapper}>
              <RecipeCard recipe={recipe} onSaveToggle={handleSaveToggle} compact />
              <button style={s.deleteBtn} onClick={() => handleDelete(recipe._id)}>🗑 Delete</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--brown)' },
  subtitle: { color: 'var(--muted)', marginTop: '4px', fontSize: '14px' },
  filters: { display: 'flex', gap: '8px' },
  filterBtn: {
    border: '1px solid var(--border)', borderRadius: '8px',
    padding: '8px 16px', fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s',
  },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' },
  cardWrapper: { position: 'relative' },
  deleteBtn: {
    width: '100%', background: 'none', border: 'none',
    color: 'var(--muted)', fontSize: '12px', cursor: 'pointer',
    padding: '8px', textAlign: 'right',
  },
  loading: { textAlign: 'center', color: 'var(--muted)', padding: '80px', fontSize: '16px' },
  empty: { textAlign: 'center', padding: '80px' },
  emptyTitle: { fontFamily: "'Playfair Display', serif", fontSize: '22px', color: 'var(--brown)', marginBottom: '8px' },
  emptyText: { color: 'var(--muted)', fontSize: '14px' },
};

export default CookbookPage;