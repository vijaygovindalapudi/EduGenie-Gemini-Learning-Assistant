// ==========================================================================
// EduGenie — Frontend Logic
// ==========================================================================

const MODULES = {
  qa: {
    title: "Ask a Question",
    eyebrow: "Module 01 · Q&A",
    desc: "Ask EduGenie anything about your syllabus and get a clear, sourced-style answer.",
    endpoint: "/qa",
    buttonLabel: "Get Answer",
    loading: "Genie is thinking…",
    fields: [
      { name: "question", label: "Your question", type: "textarea",
        placeholder: "e.g. What is the difference between TCP and UDP?", required: true }
    ]
  },
  explain: {
    title: "Explain a Concept",
    eyebrow: "Module 02 · Explanation",
    desc: "Get a step-by-step explanation of any topic, tuned to your level.",
    endpoint: "/explain",
    buttonLabel: "Explain This",
    loading: "Genie is preparing the explanation…",
    fields: [
      { name: "topic", label: "Topic or concept", type: "text",
        placeholder: "e.g. Recursion in programming", required: true },
      { name: "level", label: "Explain for", type: "select",
        options: ["Beginner", "Intermediate", "Advanced"], required: false }
    ]
  },
quiz: {
  title: "Generate a Quiz",
  eyebrow: "Module 03 · Quiz Generation",
  desc: "Create a quiz from any text passage.",
  endpoint: "/quiz",
  buttonLabel: "Generate Quiz",
  loading: "Genie is writing your quiz…",
  fields: [
    {
      name: "text",
      label: "Text for Quiz Generation",
      type: "textarea",
      placeholder: "Paste text here...",
      required: true
    }
  ]
},
  summary: {
    title: "Summarize Text",
    eyebrow: "Module 04 · Summary",
    desc: "Paste a passage, chapter, or article and get a concise summary.",
    endpoint: "/summary",
    buttonLabel: "Summarize",
    loading: "Genie is condensing the text…",
    fields: [
      { name: "text", label: "Text to summarize", type: "textarea",
        placeholder: "Paste your text here…", required: true }
    ]
  },
  "learning-path": {
    title: "Personalized Learning Path",
    eyebrow: "Module 05 · Learning Path",
    desc: "Tell EduGenie your goal and current level to get a recommended study path.",
    endpoint: "/learning-path",
    buttonLabel: "Build My Path",
    loading: "Genie is mapping your path…",
  fields: [
  {
    name: "topic",
    label: "Learning goal",
    type: "text",
    placeholder: "e.g. Python",
    required: true
  }
]
  }
};

const els = {
  nav: document.getElementById("moduleNav"),
  eyebrow: document.getElementById("moduleEyebrow"),
  title: document.getElementById("moduleTitle"),
  desc: document.getElementById("moduleDesc"),
  fields: document.getElementById("dynamicFields"),
  form: document.getElementById("genieForm"),
  submitBtn: document.getElementById("submitBtn"),
  btnLabel: document.querySelector("#submitBtn .btn-label"),
  clearBtn: document.getElementById("clearBtn"),
  copyBtn: document.getElementById("copyBtn"),
  statusPill: document.getElementById("statusPill"),
  statusText: document.getElementById("statusText"),
  empty: document.getElementById("emptyState"),
  loading: document.getElementById("loadingState"),
  loadingText: document.getElementById("loadingText"),
  error: document.getElementById("errorState"),
  errorMessage: document.getElementById("errorMessage"),
  result: document.getElementById("resultState"),
  resultContent: document.getElementById("resultContent"),
};

let currentModule = "qa";

function renderFields(moduleKey) {
  const cfg = MODULES[moduleKey];
  els.fields.innerHTML = "";

  cfg.fields.forEach((f) => {
    const wrap = document.createElement("div");
    wrap.className = "field";

    const label = document.createElement("label");
    label.textContent = f.label;
    label.setAttribute("for", f.name);
    wrap.appendChild(label);

    let input;
    if (f.type === "textarea") {
      input = document.createElement("textarea");
    } else if (f.type === "select") {
      input = document.createElement("select");
      f.options.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt;
        o.textContent = opt;
        input.appendChild(o);
      });
    } else {
      input = document.createElement("input");
      input.type = f.type;
    }

    input.id = f.name;
    input.name = f.name;
    if (f.placeholder) input.placeholder = f.placeholder;
    if (f.required) input.required = true;

    wrap.appendChild(input);
    els.fields.appendChild(wrap);
  });
}

function setActiveModule(moduleKey) {
  currentModule = moduleKey;
  const cfg = MODULES[moduleKey];

  document.querySelectorAll(".module-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.module === moduleKey);
  });

  els.eyebrow.textContent = cfg.eyebrow;
  els.title.textContent = cfg.title;
  els.desc.textContent = cfg.desc;
  els.btnLabel.textContent = cfg.buttonLabel;
  els.loadingText.textContent = cfg.loading;

  renderFields(moduleKey);
  resetOutput();
}

function resetOutput() {
  els.empty.classList.remove("hidden");
  els.loading.classList.add("hidden");
  els.error.classList.add("hidden");
  els.result.classList.add("hidden");
}

function showLoading() {
  els.empty.classList.add("hidden");
  els.error.classList.add("hidden");
  els.result.classList.add("hidden");
  els.loading.classList.remove("hidden");

  els.statusPill.classList.remove("error");
  els.statusPill.classList.add("busy");
  els.statusText.textContent = "Working…";
  els.submitBtn.disabled = true;
}

function showResult(text) {
  els.empty.classList.add("hidden");
  els.loading.classList.add("hidden");
  els.error.classList.add("hidden");
  els.result.classList.remove("hidden");
  els.resultContent.textContent = text;

  els.statusPill.classList.remove("busy", "error");
  els.statusText.textContent = "Ready";
  els.submitBtn.disabled = false;
}

function showError(message) {
  els.empty.classList.add("hidden");
  els.loading.classList.add("hidden");
  els.result.classList.add("hidden");
  els.error.classList.remove("hidden");
  els.errorMessage.textContent = message;

  els.statusPill.classList.remove("busy");
  els.statusPill.classList.add("error");
  els.statusText.textContent = "Error";
  els.submitBtn.disabled = false;
}
function extractDisplayText(data) {

  if (typeof data === "string") return data;

  // Quiz formatting
  if (data.quiz) {
    return data.quiz.map((q, i) =>
      `${i + 1}. ${q.question}

${q.options.join("\n")}

Answer: ${q.answer}`
    ).join("\n\n----------------------\n\n");
  }

  const candidates = [
    "answer",
    "explanation",
    "summary",
    "learning_path",
    "result",
    "response",
    "path",
    "output",
    "text"
  ];

  for (const key of candidates) {
    if (data && data[key] !== undefined) {
      const val = data[key];
      return typeof val === "string"
        ? val
        : JSON.stringify(val, null, 2);
    }
  }

  return JSON.stringify(data, null, 2);
}

async function handleSubmit(e) {
  e.preventDefault();
  const cfg = MODULES[currentModule];

  const formData = {};
  cfg.fields.forEach((f) => {
    const el = document.getElementById(f.name);
    let val = el.value;
    if (f.type === "number" && val !== "") val = Number(val);
    formData[f.name] = val;
  });

  // Basic required-field validation
  for (const f of cfg.fields) {
    if (f.required && !formData[f.name]) {
      showError(`Please fill in "${f.label}" before submitting.`);
      return;
    }
  }

  showLoading();

  try {
    const response = await fetch(cfg.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      let detail = `Request failed with status ${response.status}.`;
      try {
        const errBody = await response.json();
        if (errBody.detail) detail = errBody.detail;
      } catch (_) { /* ignore parse errors */ }
      throw new Error(detail);
    }

    const data = await response.json();
    showResult(extractDisplayText(data));
  } catch (err) {
    showError(err.message || "Could not reach the server. Please try again.");
  }
}

function handleClear() {
  els.form.reset();
  resetOutput();
}

function handleCopy() {
  const text = els.resultContent.textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const original = els.copyBtn.textContent;
    els.copyBtn.textContent = "Copied";
    setTimeout(() => (els.copyBtn.textContent = original), 1500);
  });
}

// ---- Event wiring ----
els.nav.addEventListener("click", (e) => {
  const btn = e.target.closest(".module-btn");
  if (!btn) return;
  setActiveModule(btn.dataset.module);
});

els.form.addEventListener("submit", handleSubmit);
els.clearBtn.addEventListener("click", handleClear);
els.copyBtn.addEventListener("click", handleCopy);

// ---- Init ----
setActiveModule("qa");
