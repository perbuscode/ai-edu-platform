// src/pages/Landing.jsx
import React, { useEffect, useReducer } from "react";
import Hero from "../components/Hero";
import ValueSection from "../components/ValueSection";
import Courses from "../components/Courses";
import Testimonials from "../components/Testimonials";
import ChatPlanner from "../components/ChatPlanner";
import PlanExampleModal from "../components/PlanExampleModal";
import BlogSection from "../components/BlogSection";
import BlogPostModal from "../components/BlogPostModal";

export const OPEN_EXAMPLE_PLAN_EVENT = "open-example-plan";
export const OPEN_PLAN_MODAL_EVENT = "open-plan-modal";
export const OPEN_BLOG_MODAL_EVENT = "open-blog-modal";

const initialState = {
  isPlanModalOpen: false,
  isBlogModalOpen: false,
  currentPlan: null,
  currentPost: null,
};

function landingReducer(state, action) {
  switch (action.type) {
    case "OPEN_PLAN_MODAL":
      return {
        ...state,
        isPlanModalOpen: true,
        currentPlan: action.payload || null,
      };
    case "OPEN_BLOG_MODAL":
      return { ...state, isBlogModalOpen: true, currentPost: action.payload };
    case "CLOSE_MODALS":
      return { ...state, isPlanModalOpen: false, isBlogModalOpen: false };
    default:
      throw new Error(`Acción desconocida: ${action.type}`);
  }
}

export default function Landing() {
  const [state, dispatch] = useReducer(landingReducer, initialState);

  useEffect(() => {
    const onOpenExample = () => dispatch({ type: "OPEN_PLAN_MODAL" });
    const onOpenPlan = (ev) =>
      dispatch({ type: "OPEN_PLAN_MODAL", payload: ev?.detail?.plan });
    const onOpenPost = (ev) =>
      dispatch({ type: "OPEN_BLOG_MODAL", payload: ev?.detail?.post });

    window.addEventListener(OPEN_EXAMPLE_PLAN_EVENT, onOpenExample);
    window.addEventListener(OPEN_PLAN_MODAL_EVENT, onOpenPlan);
    window.addEventListener(OPEN_BLOG_MODAL_EVENT, onOpenPost);
    return () => {
      window.removeEventListener(OPEN_EXAMPLE_PLAN_EVENT, onOpenExample);
      window.removeEventListener(OPEN_PLAN_MODAL_EVENT, onOpenPlan);
      window.removeEventListener(OPEN_BLOG_MODAL_EVENT, onOpenPost);
    };
  }, []);

  return (
    <>
      <main>
        <Hero />
        <ValueSection />
        <Courses />
        <Testimonials />
        <ChatPlanner />
        <BlogSection />
      </main>
      <PlanExampleModal
        open={state.isPlanModalOpen}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        plan={state.currentPlan}
      />
      <BlogPostModal
        open={state.isBlogModalOpen}
        onClose={() => dispatch({ type: "CLOSE_MODALS" })}
        post={state.currentPost}
      />
    </>
  );
}
