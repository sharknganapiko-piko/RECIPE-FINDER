import { useState, useCallback } from "react";

const QUICK_FILLS = [
  { label: "🍳 Breakfast", value: "eggs, butter, cheese, bread, milk" },
  { label: "🍝 Pasta Night", value: "pasta, garlic, olive oil, tomatoes, basil, parmesan" },
  { label: "🍗 Chicken Dinner", value: "chicken breast, garlic, lemon, rosemary, potatoes, olive oil" },
  { label: "🥗 Healthy Bowl", value: "quinoa, spinach, avocado, cucumber, chickpeas, lemon" },
  { label: "🍜 Asian Fusion", value: "rice, soy sauce, ginger, garlic, carrots, broccoli, sesame oil" },
];

const DIETARY = ["None", "Vegetarian", "Vegan", "Keto", "Gluten-free", "Halal", "Dairy-free"];
const CUISINES = ["Any", "Filipino", "Italian", "Asian", "Mexican", "Indian", "French", "Mediterranean"];
const TIMES = ["Any time", "Under 15 mins", "Under 30 mins", "Under 1 hour", "Over 1 hour"];

function SkeletonCard() {
  return (
    <div style={{ animation: "fadeIn 0.4s ease" }}>
      <div style={{
        background: "linear-gradient(135deg, #1a2e1a, #0f1f0f)",
        border: "1px solid #2a4a2a",
        borderRadius: 12,
        padding: "2rem",
        marginBottom: "1.5rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="skel" style={{ width: 56, height: 56, borderRadius: 12 }} />
          <div style={{ flex: 1 }}>
            <div className="skel" style={{ height: 28, width: "60%", borderRadius: 6, marginBottom: 8 }} />
            <div className="skel" style={{ height: 16, width: "40%", borderRadius: 4 }} />
          </div>
        </div>
        <div className="skel" style={{ height: 16, width: "90%", borderRadius: 4, marginBottom: 8 }} />
        <div className="skel" style={{ height: 16, width: "70%", borderRadius: 4, marginBottom: 8 }} />
        <div className="skel" style={{ height: 16, width: "80%", borderRadius: 4 }} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8, marginTop: "1.5rem" }}>
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skel" style={{ height: 64, borderRadius: 8 }} />
          ))}
        </div>
      </div>
      <p style={{ textAlign: "center", color: "#4ade8088", fontFamily: "monospace", fontSize: "0.85rem", animation: "pulse 1.5s ease-in-out infinite" }}>
        🤖 Claude is crafting your recipe...
      </p>
    </div>
  );
}

function NutritionCard({ label, value, unit, color }) {
  return (
    <div style={{
      background: "#0f1f0f",
      border: `1px solid ${color}44`,
      borderRadius: 10,
      padding: "1rem",
      textAlign: "center",
      flex: 1,
      minWidth: 0
    }}>
      <div style={{ fontSize: "1.4rem", fontWeight: 700, color, fontFamily: "monospace" }}>{value}</div>
      <div style={{ fontSize: "0.65rem", color: "#86efac88", marginTop: 2 }}>{unit}</div>
      <div style={{ fontSize: "0.7rem", color: "#86efac", marginTop: 4, fontFamily: "monospace" }}>{label}</div>
    </div>
  );
}

function RecipeCard({ recipe }) {
  const [servings, setServings] = useState(recipe.servings || 2);
  const [checkedSteps, setCheckedSteps] = useState({});
  const base = recipe.servings || 2;
  const ratio = servings / base;

  const scaleAmount = (amount) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return amount;
    const scaled = num * ratio;
    return scaled % 1 === 0 ? scaled : scaled.toFixed(1);
  };

  const toggleStep = (i) => setCheckedSteps(p => ({ ...p, [i]: !p[i] }));

  return (
    <div style={{ animation: "fadeIn 0.6s ease" }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a3a1a, #0f2a0f)",
        border: "1px solid #3a6a3a",
        borderRadius: 16,
        padding: "1.8rem",
        marginBottom: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
          <div style={{ fontSize: "3rem", lineHeight: 1 }}>{recipe.emoji || "🍽️"}</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "'Special Elite', cursive", fontSize: "1.6rem", color: "#4ade80", lineHeight: 1.2, margin: 0 }}>
              {recipe.name}
            </h2>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
              {recipe.cuisine && <span style={badgeStyle("#22d3ee")}>{recipe.cuisine}</span>}
              {recipe.difficulty && <span style={badgeStyle("#fbbf24")}>{recipe.difficulty}</span>}
            </div>
          </div>
        </div>
        <p style={{ color: "#86efac", fontSize: "0.88rem", lineHeight: 1.6, margin: 0 }}>{recipe.description}</p>

        {/* Meta row */}
        <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem", flexWrap: "wrap" }}>
          {[
            { label: "Prep", value: recipe.prepTime, icon: "⏱" },
            { label: "Cook", value: recipe.cookTime, icon: "🔥" },
          ].map(m => (
            <div key={m.label} style={{ background: "#0f1f0f", border: "1px solid #2a4a2a", borderRadius: 8, padding: "0.5rem 0.8rem", fontSize: "0.78rem", color: "#86efac", fontFamily: "monospace" }}>
              {m.icon} <strong style={{ color: "#4ade80" }}>{m.label}:</strong> {m.value}
            </div>
          ))}
          {/* Servings adjuster */}
          <div style={{ background: "#0f1f0f", border: "1px solid #22d3ee44", borderRadius: 8, padding: "0.4rem 0.8rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#22d3ee", fontFamily: "monospace" }}>🍽 Servings:</span>
            <button onClick={() => setServings(s => Math.max(1, s - 1))} style={adjBtn}>−</button>
            <span style={{ color: "#4ade80", fontWeight: 700, fontFamily: "monospace", minWidth: 20, textAlign: "center" }}>{servings}</span>
            <button onClick={() => setServings(s => s + 1)} style={adjBtn}>+</button>
          </div>
        </div>
      </div>

      {/* Nutrition */}
      {recipe.nutrition && (
        <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <NutritionCard label="Calories" value={Math.round(recipe.nutrition.calories * ratio)} unit="kcal" color="#fbbf24" />
          <NutritionCard label="Protein" value={`${Math.round(recipe.nutrition.protein * ratio)}g`} unit="protein" color="#4ade80" />
          <NutritionCard label="Carbs" value={`${Math.round(recipe.nutrition.carbs * ratio)}g`} unit="carbs" color="#22d3ee" />
          <NutritionCard label="Fat" value={`${Math.round(recipe.nutrition.fat * ratio)}g`} unit="fat" color="#f472b6" />
        </div>
      )}

      {/* Ingredients */}
      <div style={sectionBox}>
        <h3 style={sectionTitle}>🧺 Ingredients</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "0.6rem" }}>
          {(recipe.ingredients || []).map((ing, i) => (
            <div key={i} style={{
              background: "#0f1f0f",
              border: "1px solid #2a4a2a",
              borderRadius: 8,
              padding: "0.6rem 0.8rem",
              fontSize: "0.8rem",
              color: "#86efac",
              fontFamily: "monospace"
            }}>
              <span style={{ color: "#4ade80", fontWeight: 700 }}>{scaleAmount(ing.amount)} </span>
              {ing.item}
            </div>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div style={sectionBox}>
        <h3 style={sectionTitle}>📋 Instructions</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
          {(recipe.steps || []).map((step, i) => (
            <div
              key={i}
              onClick={() => toggleStep(i)}
              style={{
                background: checkedSteps[i] ? "#0a2a0a" : "#0f1f0f",
                border: `1px solid ${checkedSteps[i] ? "#4ade80" : "#2a4a2a"}`,
                borderRadius: 10,
                padding: "0.9rem 1rem",
                cursor: "pointer",
                opacity: checkedSteps[i] ? 0.5 : 1,
                transition: "all 0.3s ease",
                display: "flex",
                gap: "0.8rem",
                alignItems: "flex-start"
              }}
            >
              <div style={{
                width: 26, height: 26, borderRadius: "50%",
                background: checkedSteps[i] ? "#4ade80" : "#1a3a1a",
                border: `2px solid ${checkedSteps[i] ? "#4ade80" : "#3a6a3a"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, fontSize: "0.7rem", color: checkedSteps[i] ? "#0f1f0f" : "#4ade80",
                fontWeight: 700, fontFamily: "monospace", transition: "all 0.3s"
              }}>
                {checkedSteps[i] ? "✓" : i + 1}
              </div>
              <div>
                {step.title && <div style={{ fontWeight: 700, color: "#4ade80", fontSize: "0.82rem", marginBottom: 3, fontFamily: "monospace", textDecoration: checkedSteps[i] ? "line-through" : "none" }}>{step.title}</div>}
                <div style={{ color: "#86efac", fontSize: "0.82rem", lineHeight: 1.6, textDecoration: checkedSteps[i] ? "line-through" : "none" }}>{step.instruction}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <div style={{ ...sectionBox, borderColor: "#fbbf2444" }}>
          <h3 style={{ ...sectionTitle, color: "#fbbf24" }}>💡 Chef's Tips</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {recipe.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start" }}>
                <span style={{ color: "#fbbf24", fontFamily: "monospace", fontSize: "0.85rem", flexShrink: 0 }}>→</span>
                <span style={{ color: "#d1fae5", fontSize: "0.83rem", lineHeight: 1.6 }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const badgeStyle = (color) => ({
  background: color + "22",
  border: `1px solid ${color}55`,
  color,
  borderRadius: 6,
  padding: "0.15rem 0.55rem",
  fontSize: "0.7rem",
  fontFamily: "monospace"
});

const adjBtn = {
  background: "#1a3a1a",
  border: "1px solid #2a4a2a",
  color: "#4ade80",
  borderRadius: 4,
  width: 24, height: 24,
  cursor: "pointer",
  fontSize: "0.9rem",
  fontFamily: "monospace",
  display: "flex", alignItems: "center", justifyContent: "center"
};

const sectionBox = {
  background: "linear-gradient(135deg, #1a2e1a, #0f1f0f)",
  border: "1px solid #2a4a2a",
  borderRadius: 12,
  padding: "1.3rem",
  marginBottom: "1rem"
};

const sectionTitle = {
  fontFamily: "'Special Elite', cursive",
  fontSize: "1.1rem",
  color: "#4ade80",
  marginBottom: "0.9rem",
  margin: "0 0 0.9rem 0"
};

export default function AIRecipeFinder() {
  const [ingredients, setIngredients] = useState("");
  const [dietary, setDietary] = useState("None");
  const [cuisine, setCuisine] = useState("Any");
  const [time, setTime] = useState("Any time");
  const [loading, setLoading] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [error, setError] = useState(null);

  const generateRecipe = useCallback(async () => {
    if (!ingredients.trim()) return;
    setLoading(true);
    setError(null);
    setRecipe(null);

    const prompt = `You are a world-class chef AI. Generate a creative, delicious recipe based on the ingredients provided.

Ingredients available: ${ingredients}
${dietary !== "None" ? `Dietary requirement: ${dietary}` : ""}
${cuisine !== "Any" ? `Cuisine style: ${cuisine}` : ""}
${time !== "Any time" ? `Cooking time: ${time}` : ""}

Respond ONLY with a valid JSON object (no markdown, no extra text) in this exact structure:
{
  "name": "Recipe Name",
  "emoji": "🍽️",
  "description": "A short 1-2 sentence description",
  "prepTime": "10 mins",
  "cookTime": "20 mins",
  "servings": 2,
  "difficulty": "Easy",
  "cuisine": "Italian",
  "ingredients": [
    {"amount": "2", "item": "eggs"},
    {"amount": "1 cup", "item": "flour"}
  ],
  "steps": [
    {"title": "Prep the base", "instruction": "Detailed instruction here."},
    {"title": "Cook", "instruction": "Detailed instruction here."}
  ],
  "tips": [
    "Tip 1 here",
    "Tip 2 here"
  ],
  "nutrition": {
    "calories": 320,
    "protein": 18,
    "carbs": 40,
    "fat": 12
  }
}`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }]
        })
      });

      const data = await response.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setRecipe(parsed);
    } catch (err) {
      setError("Failed to generate recipe. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [ingredients, dietary, cuisine, time]);

  const selectStyle = {
    background: "#0f1f0f",
    border: "1px solid #2a4a2a",
    color: "#86efac",
    borderRadius: 8,
    padding: "0.5rem 0.7rem",
    fontSize: "0.78rem",
    fontFamily: "monospace",
    cursor: "pointer",
    outline: "none",
    flex: 1,
    minWidth: 0
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Special+Elite&family=Courier+Prime:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0d1f0d; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }
        .skel {
          background: linear-gradient(90deg, #1a3a1a 25%, #2a5a2a 50%, #1a3a1a 75%);
          background-size: 400px 100%;
          animation: shimmer 1.4s infinite;
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #0d1f0d; }
        ::-webkit-scrollbar-thumb { background: #2a4a2a; border-radius: 3px; }
        select option { background: #0f1f0f; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "#0d1f0d",
        fontFamily: "system-ui, sans-serif",
        color: "#d1fae5",
        padding: "1.5rem 1rem 4rem"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem", animation: "fadeIn 0.6s ease" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.3rem" }}>🍳🔍</div>
          <h1 style={{
            fontFamily: "'Special Elite', cursive",
            fontSize: "clamp(2rem, 7vw, 3rem)",
            color: "#4ade80",
            textShadow: "0 0 40px #4ade8044",
            letterSpacing: "0.04em",
            lineHeight: 1
          }}>AI RECIPE FINDER</h1>
          <p style={{ color: "#86efac88", fontFamily: "monospace", fontSize: "0.78rem", marginTop: "0.4rem" }}>
            Powered by Anthropic Claude · Enter ingredients, get a full recipe
          </p>
        </div>

        {/* Input Panel */}
        <div style={{
          maxWidth: 640,
          margin: "0 auto 2rem",
          background: "linear-gradient(135deg, #1a2e1a, #0f1f0f)",
          border: "1px solid #2a4a2a",
          borderRadius: 16,
          padding: "1.5rem",
          animation: "fadeIn 0.7s ease"
        }}>
          {/* Quick fills */}
          <div style={{ marginBottom: "1rem" }}>
            <div style={{ fontFamily: "monospace", fontSize: "0.7rem", color: "#4ade8088", marginBottom: "0.5rem", letterSpacing: "0.1em" }}>QUICK FILL</div>
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
              {QUICK_FILLS.map(q => (
                <button key={q.label} onClick={() => setIngredients(q.value)} style={{
                  background: "#0f1f0f", border: "1px solid #2a4a2a",
                  color: "#86efac", borderRadius: 6, padding: "0.3rem 0.6rem",
                  fontSize: "0.72rem", cursor: "pointer", fontFamily: "monospace",
                  transition: "all 0.2s"
                }}
                  onMouseEnter={e => { e.target.style.borderColor = "#4ade80"; e.target.style.color = "#4ade80"; }}
                  onMouseLeave={e => { e.target.style.borderColor = "#2a4a2a"; e.target.style.color = "#86efac"; }}
                >{q.label}</button>
              ))}
            </div>
          </div>

          {/* Textarea */}
          <textarea
            value={ingredients}
            onChange={e => setIngredients(e.target.value)}
            placeholder="e.g. chicken, garlic, lemon, potatoes, olive oil, rosemary..."
            rows={3}
            style={{
              width: "100%", background: "#0f1f0f",
              border: "1px solid #2a4a2a", borderRadius: 10,
              color: "#d1fae5", fontFamily: "monospace", fontSize: "0.85rem",
              padding: "0.9rem", resize: "vertical", outline: "none",
              lineHeight: 1.6, marginBottom: "1rem",
              transition: "border-color 0.2s"
            }}
            onFocus={e => e.target.style.borderColor = "#4ade80"}
            onBlur={e => e.target.style.borderColor = "#2a4a2a"}
          />

          {/* Filters */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#4ade8088", marginBottom: 4, letterSpacing: "0.1em" }}>DIETARY</div>
              <select value={dietary} onChange={e => setDietary(e.target.value)} style={selectStyle}>
                {DIETARY.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#4ade8088", marginBottom: 4, letterSpacing: "0.1em" }}>CUISINE</div>
              <select value={cuisine} onChange={e => setCuisine(e.target.value)} style={selectStyle}>
                {CUISINES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: "1 1 140px", minWidth: 0 }}>
              <div style={{ fontFamily: "monospace", fontSize: "0.65rem", color: "#4ade8088", marginBottom: 4, letterSpacing: "0.1em" }}>TIME</div>
              <select value={time} onChange={e => setTime(e.target.value)} style={selectStyle}>
                {TIMES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateRecipe}
            disabled={loading || !ingredients.trim()}
            style={{
              width: "100%",
              background: loading || !ingredients.trim() ? "#1a3a1a" : "linear-gradient(135deg, #166534, #14532d)",
              border: `2px solid ${loading || !ingredients.trim() ? "#2a4a2a" : "#4ade80"}`,
              color: loading || !ingredients.trim() ? "#4ade8055" : "#4ade80",
              borderRadius: 10, padding: "0.85rem",
              fontFamily: "'Special Elite', cursive",
              fontSize: "1.1rem", cursor: loading || !ingredients.trim() ? "not-allowed" : "pointer",
              letterSpacing: "0.05em", transition: "all 0.3s",
              boxShadow: loading || !ingredients.trim() ? "none" : "0 0 20px #4ade8022"
            }}
          >
            {loading ? "✨ Generating Recipe..." : "✨ Generate Recipe"}
          </button>

          {recipe && !loading && (
            <button
              onClick={generateRecipe}
              style={{
                width: "100%", marginTop: "0.5rem",
                background: "transparent", border: "1px solid #2a4a2a",
                color: "#86efac88", borderRadius: 8, padding: "0.55rem",
                fontFamily: "monospace", fontSize: "0.78rem", cursor: "pointer"
              }}
            >
              🔄 Regenerate with same ingredients
            </button>
          )}
        </div>

        {/* Output */}
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          {error && (
            <div style={{
              background: "#2a0f0f", border: "1px solid #f87171",
              borderRadius: 10, padding: "1rem", color: "#fca5a5",
              fontFamily: "monospace", fontSize: "0.82rem", textAlign: "center"
            }}>⚠️ {error}</div>
          )}
          {loading && <SkeletonCard />}
          {recipe && !loading && <RecipeCard recipe={recipe} />}
          {!recipe && !loading && !error && (
            <div style={{
              textAlign: "center", color: "#4ade8033",
              fontFamily: "monospace", fontSize: "0.82rem",
              padding: "3rem 1rem", border: "1px dashed #2a4a2a",
              borderRadius: 12, lineHeight: 2
            }}>
              🍽️<br/>Enter ingredients above<br/>and hit Generate Recipe
            </div>
          )}
        </div>
      </div>
    </>
  );
}
