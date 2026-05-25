import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const MEALS = ['breakfast', 'lunch', 'dinner'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };
const MEAL_ICONS = { breakfast: '☀️', lunch: '🌤', dinner: '🌙' };

const MealPlanPage = () => {
  const [plan, setPlan] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState('');

  useEffect(() => {
    Promise.all([
      axios.get('/api/mealplan'),
      axios.get('/api/recipes'),
    ])
      .then(([planRes, recipesRes]) => {
        setPlan(planRes.data);
        setRecipes(recipesRes.data);
      })
      .catch(() => toast.error('Failed to load meal plan'))
      .finally(() => setLoading(false));
  }, []);

  const assignMeal = async (day, mealType, recipeId) => {
    try {
      const res = await axios.patch('/api/mealplan', { day, mealType, recipeId: recipeId || null });
      setPlan(res.data);
      setAssigning(null);
      setSelectedRecipe('');
      toast.success(recipeId ? 'Meal assigned!' : 'Meal cleared');
    } catch {
      toast.error('Failed to update meal plan');
    }
  };

  const getSlot = (day, meal) => plan?.days?.[day]?.[meal];

  if (loading) return <div style={s.loading}>Loading your meal plan...</div>;

  return (
    <div style={s.page}>
      <div style={s.header}>
        <h1 style={s.title}>Weekly Meal Plan</h1>
        <p style={s.subtitle}>Click any slot to assign a recipe from your cookbook</p>
      </div>

      <div style={s.grid}>
        <div style={s.cornerCell} />

        {DAYS.map(day => (
          <div key={day} style={s.dayHeader}>{DAY_LABELS[day]}</div>
        ))}

        {MEALS.map(meal => (
          <div key={meal} style={{ display: "contents" }}>
            <div style={s.mealLabel}>
              <span>{MEAL_ICONS[meal]}</span>
              <span style={s.mealLabelText}>
                {meal.charAt(0).toUpperCase() + meal.slice(1)}
              </span>
            </div>

            {DAYS.map(day => {
              const slot = getSlot(day, meal);
              const isAssigning = assigning?.day === day && assigning?.meal === meal;

              return (
                <div
                  key={`${day}-${meal}`}
                  style={{
                    ...s.cell,
                    background: slot ? 'rgba(200,96,58,0.06)' : 'white',
                    borderColor: slot ? 'rgba(200,96,58,0.2)' : 'var(--border)'
                  }}
                  onClick={() => {
                    if (!isAssigning) {
                      setAssigning({ day, meal });
                      setSelectedRecipe(slot?._id || '');
                    }
                  }}
                >
                  {isAssigning ? (
                    <div style={s.assignBox} onClick={e => e.stopPropagation()}>
                      <select
                        style={s.assignSelect}
                        value={selectedRecipe}
                        onChange={e => setSelectedRecipe(e.target.value)}
                        autoFocus
                      >
                        <option value="">— None —</option>
                        {recipes.map(r => (
                          <option key={r._id} value={r._id}>{r.title}</option>
                        ))}
                      </select>

                      <div style={s.assignBtns}>
                        <button
                          style={s.assignConfirm}
                          onClick={() => assignMeal(day, meal, selectedRecipe)}
                        >
                          ✓
                        </button>

                        <button
                          style={s.assignCancel}
                          onClick={() => setAssigning(null)}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : slot ? (
                    <div style={s.slotFilled}>
                      <p style={s.slotTitle}>{slot.title}</p>
                      <p style={s.slotMeta}>{slot.cookTime}m · {slot.difficulty}</p>
                    </div>
                  ) : (
                    <div style={s.slotEmpty}>+ Add</div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {plan && (
        <div style={s.summary}>
          <h3 style={s.summaryTitle}>📋 This Week's Meals</h3>

          <div style={s.summaryGrid}>
            {DAYS.map(day => {
              const dayMeals = MEALS.map(m => getSlot(day, m)).filter(Boolean);
              if (!dayMeals.length) return null;

              return (
                <div key={day} style={s.summaryDay}>
                  <p style={s.summaryDayLabel}>
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </p>

                  {dayMeals.map(r => (
                    <p key={r._id} style={s.summaryMeal}>• {r.title}</p>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const s = {
  page: { maxWidth: '1100px', margin: '0 auto', padding: '40px 24px' },
  header: { marginBottom: '32px' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: '36px', color: 'var(--brown)' },
  subtitle: { color: 'var(--muted)', marginTop: '6px', fontSize: '14px' },

  grid: {
    display: 'grid',
    gridTemplateColumns: '80px repeat(7, 1fr)',
    gap: '6px',
    marginBottom: '40px',
  },

  cornerCell: { background: 'none' },

  dayHeader: {
    background: 'var(--terracotta)',
    color: 'white',
    borderRadius: '8px',
    padding: '8px 4px',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '500',
  },

  mealLabel: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '8px 4px',
    background: 'var(--warm)',
    borderRadius: '8px',
    border: '1px solid var(--border)',
  },

  mealLabelText: { fontSize: '10px', color: 'var(--brown-mid)', fontWeight: '500' },

  cell: {
    border: '1px solid',
    borderRadius: '8px',
    minHeight: '80px',
    cursor: 'pointer',
    transition: 'border-color 0.15s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
  },

  slotFilled: { width: '100%' },
  slotTitle: { fontSize: '11px', color: 'var(--brown)', fontWeight: '500', marginBottom: '4px' },
  slotMeta: { fontSize: '10px', color: 'var(--muted)' },
  slotEmpty: { color: 'var(--border)', fontSize: '12px', fontWeight: '500' },

  assignBox: { display: 'flex', flexDirection: 'column', gap: '6px', width: '100%', padding: '4px' },
  assignSelect: { fontSize: '11px', border: '1px solid var(--terracotta)', borderRadius: '6px', padding: '4px', width: '100%' },

  assignBtns: { display: 'flex', gap: '4px' },

  assignConfirm: {
    flex: 1,
    background: 'var(--terracotta)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    padding: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  assignCancel: {
    flex: 1,
    background: 'var(--warm)',
    color: 'var(--brown-mid)',
    border: '1px solid var(--border)',
    borderRadius: '6px',
    padding: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },

  summary: {
    background: 'white',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid var(--border)',
  },

  summaryTitle: {
    fontFamily: "'Playfair Display', serif",
    color: 'var(--brown)',
    marginBottom: '16px',
    fontStyle: 'italic',
  },

  summaryGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '16px' },
  summaryDay: {},
  summaryDayLabel: { fontWeight: '500', color: 'var(--terracotta)', fontSize: '13px', marginBottom: '6px', textTransform: 'capitalize' },
  summaryMeal: { fontSize: '12px', color: 'var(--brown-mid)', lineHeight: '1.8' },

  loading: { textAlign: 'center', padding: '80px', color: 'var(--muted)', fontSize: '16px' },
};

export default MealPlanPage;