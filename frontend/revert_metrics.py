from pathlib import Path
path = Path(r"C:\proyectos\ai-edu-project\frontend\src\sections\Metrics.jsx")
text = path.read_text()
text = text.replace('  { label: "Racha", value: "3 d\u00edas" },', '  { label: "Racha", value: "3 días" },')
text = text.replace('            <p className="text-2xl font-bold text-slate-900 whitespace-nowrap">',
                    '            <p className="text-2xl font-bold text-slate-900">')
path.write_text(text)
