import axios from 'axios';
import toast from 'react-hot-toast';

const RecipeCard = ({ recipe, onSaveToggle }) => {
  const handleSave = async (e) => {
    e.stopPropagation();
    try {
      const res = await axios.patch(`/api/recipes/${recipe._id}/save`);
      onSaveToggle?.(res.data);
      toast.success(res.data.isSaved ? 'Saved to Cookbook!' : 'Removed from Cookbook');
    } catch {
      toast.error('Failed to save');
    }
  };

  return (
    <div style={styles.card}>
      <div style={styles.titleRow}>
        <h2 style={styles.title}>{recipe.title}</h2>
        <button onClick={handleSave} style={styles.saveBtn}>
          {recipe.isSaved ? '🔖 Saved' : '📌 Save'}
        </button>
      </div>

      {recipe.description && (
        <p style={styles.description}>{recipe.description}</p>
      )}

      <div style={styles.metaRow}>
        {recipe.cuisine && <span style={styles.tag}>{recipe.cuisine}</span>}
        {recipe.cookTime && <span style={styles.meta}>⏱ {recipe.cookTime} mins</span>}
        {recipe.servings && <span style={styles.meta}>👥 {recipe.servings} servings</span>}
        {recipe.calories && <span style={styles.meta}>🔥 {recipe.calories} cal</span>}
        {recipe.difficulty && <span style={styles.meta}>📊 {recipe.difficulty}</span>}
      </div>

      {recipe.dietaryTags && recipe.dietaryTags.length > 0 && (
        <div style={styles.tagsRow}>
          {recipe.dietaryTags.map((tag, i) => (
            <span key={i} style={styles.dietTag}>{tag}</span>
          ))}
        </div>
      )}

      {recipe.ingredients && recipe.ingredients.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>🥕 Ingredients</h3>
          <ul style={styles.list}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i} style={styles.ingredientItem}>
                <span style={styles.amount}>{ing.amount}</span>
                <span>{ing.name}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {recipe.steps && recipe.steps.length > 0 && (
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>👨‍🍳 Instructions</h3>
          <ol style={styles.stepList}>
            {recipe.steps.map((step, i) => (
              <li key={i} style={styles.step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
};

const styles = {
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e8ddd2',
    boxShadow: '0 4px 20px rgba(61,43,31,0.1)',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
    gap: '12px',
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '22px',
    color: '#3d2b1f',
    margin: 0,
    lineHeight: 1.3,
  },
  saveBtn: {
    background: '#c8603a',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    padding: '8px 14px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  description: {
    color: '#6b4c35',
    fontSize: '14px',
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  metaRow: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
    marginBottom: '12px',
  },
  tag: {
    background: 'rgba(200,96,58,0.1)',
    color: '#c8603a',
    fontSize: '12px',
    fontWeight: '600',
    padding: '4px 10px',
    borderRadius: '20px',
  },
  meta: {
    color: '#6b4c35',
    fontSize: '13px',
  },
  tagsRow: {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
    marginBottom: '16px',
  },
  dietTag: {
    background: 'rgba(122,158,126,0.15)',
    color: '#5a7e5e',
    fontSize: '11px',
    padding: '3px 8px',
    borderRadius: '20px',
  },
  section: {
    marginTop: '20px',
    paddingTop: '20px',
    borderTop: '1px solid #f0e8e0',
  },
  sectionTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '16px',
    color: '#c8603a',
    marginBottom: '12px',
    fontStyle: 'italic',
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  ingredientItem: {
    display: 'flex',
    gap: '12px',
    fontSize: '14px',
    color: '#2c1f14',
    padding: '6px 0',
    borderBottom: '1px solid #faf6f0',
  },
  amount: {
    color: '#c8603a',
    fontWeight: '600',
    minWidth: '90px',
  },
  stepList: {
    paddingLeft: '20px',
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  step: {
    fontSize: '14px',
    color: '#2c1f14',
    lineHeight: '1.6',
    paddingBottom: '8px',
  },
};

export default RecipeCard