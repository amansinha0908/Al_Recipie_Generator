import { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import RecipeCard from '../components/RecipeCard';

const CUISINES = ['Any', 'Indian', 'Italian', 'Chinese', 'Mexican', 'Mediterranean', 'Thai', 'American'];
const MEAL_TYPES = ['Any', 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Dessert'];
const DIETARY = ['None', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Dairy-Free'];

const GeneratePage = () => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('Any');
  const [mealType, setMealType] = useState('Any');
  const [dietary, setDietary] = useState('None');
  const [maxTime, setMaxTime] = useState(45);
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);

  const generate = async () => {
    if (!ingredients.trim()) {
      toast.error('Please enter at least one ingredient!');
      return;
    }
    try {
      setLoading(true);
      setRecipe(null);
      const res = await axios.post('/api/recipes/generate', {
        ingredients,
        cuisine: cuisine === 'Any' ? '' : cuisine,
        mealType: mealType === 'Any' ? '' : mealType,
        dietary: dietary === 'None' ? '' : dietary,
        maxTime,
      });
      setRecipe(res.data);
      toast.success('Recipe generated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate recipe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.page}>
      {/* Hero */}
      <div style={s.hero}>
        <h1 style={s.heroTitle}>What's in your kitchen?</h1>
        <p style={s.heroSub}>Tell us your ingredients and preferences — our AI will craft the perfect recipe for you.</p>
      </div>

      <div style={s.layout}>
        {/* Left Panel - Form */}
        <div style={s.formPanel}>
          <div style={s.formGroup}>
            <label style={s.label}>🥘 Ingredients you have</label>
            <textarea
              style={s.textarea}
              value={ingredients}
              onChange={e => setIngredients(e.target.value)}
              placeholder="honey, chicken, garlic"
              rows={4}
            />
            <p style={s.hint}>Separate with commas. Leave blank for surprise!</p>
          </div>

          <div style={s.row}>
            <div style={s.formGroup}>
              <label style={s.label}>🌍 Cuisine</label>
              <select style={s.select} value={cuisine} onChange={e => setCuisine(e.target.value)}>
                {CUISINES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>🕐 Meal type</label>
              <select style={s.select} value={mealType} onChange={e => setMealType(e.target.value)}>
                {MEAL_TYPES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>

          <div style={s.row}>
            <div style={s.formGroup}>
              <label style={s.label}>🥗 Dietary</label>
              <select style={s.select} value={dietary} onChange={e => setDietary(e.target.value)}>
                {DIETARY.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={s.formGroup}>
              <label style={s.label}>⏱ Max time (mins)</label>
              <input
                type="number"
                style={s.select}
                value={maxTime}
                onChange={e => setMaxTime(e.target.value)}
                min={10}
                max={180}
              />
            </div>
          </div>

          <button style={s.btn} onClick={generate} disabled={loading}>
            {loading ? '⏳ Generating...' : '✨ Generate Recipe'}
          </button>
        </div>

        {/* Right Panel - Recipe */}
        <div style={s.resultPanel}>
          {loading && (
            <div style={s.loadingBox}>
              <p style={s.loadingIcon}>👨‍🍳</p>
              <p style={s.loadingText}>AI is crafting your recipe...</p>
              <p style={s.loadingHint}>This takes about 5-10 seconds</p>
            </div>
          )}

          {!loading && recipe && (
            <div>
              <div style={s.resultHeader}>
                <p style={s.resultLabel}>AI-Generated Recipe</p>
                <button style={s.regenerateBtn} onClick={generate}>↺ Regenerate</button>
              </div>
              <RecipeCard recipe={recipe} onSaveToggle={(r) => setRecipe(r)} />
            </div>
          )}

          {!loading && !recipe && (
            <div style={s.emptyBox}>
              <p style={{ fontSize: '64px' }}>🍳</p>
              <p style={s.emptyTitle}>Your recipe will appear here</p>
              <p style={s.emptyHint}>Enter ingredients and click Generate!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const s = {
  page: { minHeight: '100vh', background: 'var(--cream)' },
  hero: {
    textAlign: 'center',
    padding: '48px 24px 32px',
    background: 'linear-gradient(to bottom, var(--warm), var(--cream))',
  },
  heroTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: '40px',
    color: 'var(--brown)',
    marginBottom: '12px',
  },
  heroSub: { color: 'var(--muted)', fontSize: '16px', maxWidth: '500px', margin: '0 auto' },
  layout: {
    display: 'grid',
    gridTemplateColumns: '1fr 1.4fr',
    gap: '32px',
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '0 24px 60px',
  },
  formPanel: {
    background: 'white',
    borderRadius: '20px',
    padding: '28px',
    border: '1px solid var(--border)',
    boxShadow: '0 2px 16px rgba(61,43,31,0.07)',
    height: 'fit-content',
  },
  formGroup: { marginBottom: '18px', flex: 1 },
  label: { display: 'block', fontSize: '13px', fontWeight: '500', color: 'var(--brown-mid)', marginBottom: '8px' },
  textarea: {
    width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px',
    padding: '12px', fontSize: '14px', resize: 'vertical', fontFamily: "'DM Sans', sans-serif",
    color: 'var(--text)', background: 'var(--cream)', boxSizing: 'border-box',
  },
  hint: { fontSize: '11px', color: 'var(--muted)', marginTop: '4px' },
  row: { display: 'flex', gap: '12px' },
  select: {
    width: '100%', border: '1.5px solid var(--border)', borderRadius: '10px',
    padding: '10px 12px', fontSize: '14px', color: 'var(--text)', background: 'var(--cream)',
    boxSizing: 'border-box',
  },
  btn: {
    width: '100%', background: 'var(--terracotta)', color: 'white', border: 'none',
    borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: '600',
    cursor: 'pointer', marginTop: '8px',
  },
  resultPanel: { minHeight: '400px' },
  resultHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px',
  },
  resultLabel: { fontSize: '12px', color: 'var(--muted)', fontStyle: 'italic' },
  regenerateBtn: {
    background: 'none', border: '1px solid var(--border)', borderRadius: '8px',
    padding: '6px 14px', fontSize: '13px', color: 'var(--brown-mid)', cursor: 'pointer',
  },
  loadingBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '300px', gap: '12px',
  },
  loadingIcon: { fontSize: '52px', margin: 0 },
  loadingText: {
    fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--brown)', margin: 0,
  },
  loadingHint: { color: 'var(--muted)', fontSize: '14px', margin: 0 },
  emptyBox: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', height: '300px', gap: '8px',
  },
  emptyTitle: {
    fontFamily: "'Playfair Display', serif", fontSize: '20px', color: 'var(--brown)', margin: 0,
  },
  emptyHint: { color: 'var(--muted)', fontSize: '14px', margin: 0 },
};

export default GeneratePage;