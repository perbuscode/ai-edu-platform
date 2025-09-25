// src/pages/CV.jsx
import React from "react";
import Topbar from "../components/Topbar";
import { jsPDF } from "jspdf";

const resume = {
  name: "Jacqueline Thompson",
  contact: [
    "123 Anywhere St., Any City",
    "123-456-7890",
    "hello@reallygreatsite.com",
    "www.reallygreatsite.com",
  ],
  summary:
    "Results-oriented Engineering Executive with a proven track record of optimizing project outcomes. Skilled in strategic project management and team leadership. Seeking a challenging executive role to leverage technical expertise and drive engineering excellence.",
  experience: [
    {
      title: "Engineering Executive",
      company: "Borello Technologies",
      dates: "Jan 2023 - Present",
      bullets: [
        "Implemented cost-effective solutions, resulting in a 20% reduction in project expenses.",
        "Streamlined project workflows, enhancing overall efficiency by 25%.",
        "Led a team in successfully delivering a complex engineering project on time and within budget.",
      ],
    },
    {
      title: "Project Engineer",
      company: "Salford & Co",
      dates: "Mar 2021 - Dec 2022",
      bullets: [
        "Managed project timelines, reducing delivery times by 30%.",
        "Spearheaded the adoption of cutting-edge engineering software, improving productivity by 15%.",
        "Collaborated with cross-functional teams, increasing project success rates by 10%.",
      ],
    },
    {
      title: "Graduate Engineer",
      company: "Arrowal Industries",
      dates: "Feb 2020 - Jan 2021",
      bullets: [
        "Coordinated project schedules, ensuring adherence to engineering standards and regulations.",
        "Conducted project analyses, identifying and rectifying discrepancies in requirements.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Science in Mechanical Engineering",
      institution: "University of Engineering and Technology",
      dates: "Sep 2019 - Oct 2020",
      detail: "Specialization in Advanced Manufacturing.",
    },
    {
      degree: "Bachelor of Science in Civil Engineering",
      institution: "City College of Engineering",
      dates: "Aug 2015 - Aug 2019",
      detail: "Coursework in Structural Design and Project Management.",
    },
  ],
  additional: [
    {
      label: "Technical Skills",
      value: "Project Management, Structural Analysis, Robotics and Automation, CAD",
    },
    {
      label: "Languages",
      value: "English, Malay, German",
    },
    {
      label: "Certifications",
      value: "Professional Engineer (PE) License, Project Management Professional (PMP)",
    },
    {
      label: "Awards & Achievements",
      value: "Received the Engineering Excellence Award for outstanding contributions to project innovation at Borello Technologies.",
    },
  ],
};

const bulletChar = "\u2022";

export default function CV() {
  function downloadPDF() {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 48;
    const lineHeight = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
    const maxWidth = pageWidth - margin * 2;
    let y = margin;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(resume.name.toUpperCase(), margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    y += 20;
    doc.text(resume.contact.join(` ${bulletChar} `), margin, y, { maxWidth });

    const drawSectionTitle = (title) => {
      y += 28;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.text(title.toUpperCase(), margin, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      y += 18;
    };

    drawSectionTitle("Summary");
    const summaryLines = doc.splitTextToSize(resume.summary, maxWidth);
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * lineHeight;

    drawSectionTitle("Work Experience");
    resume.experience.forEach((job) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${job.title}, ${job.company}`, margin, y);
      doc.setFont("helvetica", "italic");
      doc.text(job.dates, pageWidth - margin, y, { align: "right" });
      doc.setFont("helvetica", "normal");
      y += lineHeight;
      job.bullets.forEach((bullet) => {
        const bulletLines = doc.splitTextToSize(`${bulletChar} ${bullet}`, maxWidth);
        doc.text(bulletLines, margin, y);
        y += bulletLines.length * lineHeight;
      });
      y += lineHeight;
    });

    drawSectionTitle("Education");
    resume.education.forEach((edu) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(edu.degree, margin, y);
      doc.setFont("helvetica", "italic");
      doc.text(edu.dates, pageWidth - margin, y, { align: "right" });
      y += lineHeight;
      doc.setFont("helvetica", "normal");
      doc.text(edu.institution, margin, y);
      y += lineHeight;
      if (edu.detail) {
        const detailLines = doc.splitTextToSize(edu.detail, maxWidth);
        doc.text(detailLines, margin, y);
        y += detailLines.length * lineHeight;
      }
      y += lineHeight;
    });

    drawSectionTitle("Additional Information");
    resume.additional.forEach((item) => {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${item.label}:`, margin, y);
      doc.setFont("helvetica", "normal");
      const valueLines = doc.splitTextToSize(item.value, maxWidth);
      doc.text(valueLines, margin + 70, y);
      y += valueLines.length * lineHeight + lineHeight;
    });

    doc.save("Jacqueline_Thompson_CV.pdf");
  }

  return (
    <div className="bg-slate-900 min-h-screen text-slate-100">
      <Topbar leftOffsetClass="left-0" showLogo title="CV profesional" />
      <main className="pt-20 pb-16">
        <div className="max-w-5xl mx-auto px-4 md:px-6 space-y-6">
          <section className="bg-white text-slate-900 rounded-2xl shadow-xl border border-slate-200 p-8">
            <header className="border-b border-slate-200 pb-6">
              <p className="text-xs font-semibold tracking-[0.35em] text-slate-500 uppercase">Professional resume</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 uppercase">{resume.name}</h1>
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
                {resume.contact.map((item, index) => (
                  <span key={item} className="flex items-center gap-2">
                    {index > 0 && <span className="text-slate-400">{bulletChar}</span>}
                    <span>{item}</span>
                  </span>
                ))}
              </div>
            </header>

            <div className="mt-6 space-y-8">
              <div>
                <h2 className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">Summary</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-700">{resume.summary}</p>
              </div>

              <div>
                <h2 className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">Work Experience</h2>
                <div className="mt-3 space-y-5">
                  {resume.experience.map((job) => (
                    <article key={`${job.title}-${job.company}`} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{job.title}, {job.company}</h3>
                        <span className="text-sm text-slate-500">{job.dates}</span>
                      </div>
                      <ul className="mt-3 space-y-2 text-sm text-slate-700 list-disc pl-5">
                        {job.bullets.map((bullet) => (
                          <li key={bullet}>{bullet}</li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">Education</h2>
                <div className="mt-3 space-y-4">
                  {resume.education.map((edu) => (
                    <article key={edu.degree} className="grid gap-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="text-base font-semibold text-slate-900">{edu.degree}</h3>
                        <span className="text-sm text-slate-500">{edu.dates}</span>
                      </div>
                      <p className="text-sm text-slate-600">{edu.institution}</p>
                      {edu.detail && <p className="text-sm text-slate-600">{edu.detail}</p>}
                    </article>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xs font-semibold tracking-[0.3em] text-slate-500 uppercase">Additional Information</h2>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  {resume.additional.map((item) => (
                    <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{item.label}</p>
                      <p className="mt-2 text-sm text-slate-700 leading-relaxed">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <div className="mt-6 flex justify-end">
            <button
              onClick={downloadPDF}
              className="px-4 py-2 rounded-lg bg-sky-500 text-sm font-medium text-white hover:bg-sky-400"
            >
              Descargar PDF
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
