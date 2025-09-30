// src/components/StudyPlanModal.jsx
import React, { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  XMarkIcon,
  BookOpenIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

export default function StudyPlanModal({ plan, isOpen, onClose }) {
  if (!plan) return null;

  const modules = plan.blocks || [];

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex items-start justify-between">
                  <div>
                    <Dialog.Title
                      as="h3"
                      className="text-2xl font-bold leading-6 text-gray-900"
                    >
                      ¡Tu Plan de Estudio Personalizado!
                    </Dialog.Title>
                    <p className="mt-2 text-lg text-gray-600">{plan.title}</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.description ||
                        `Un plan para alcanzar tu objetivo: "${plan.goal}"`}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="ml-4 rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                    onClick={onClose}
                  >
                    <span className="sr-only">Cerrar</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 space-y-6">
                  {modules.map((module, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                    >
                      <div className="flex items-center">
                        <BookOpenIcon className="h-6 w-6 text-sky-600 mr-3" />
                        <h4 className="text-lg font-semibold text-gray-800">
                          {module.title}
                        </h4>
                      </div>
                      <ul className="mt-3 ml-9 list-disc space-y-2 pl-5 text-gray-600">
                        {(module.bullets || []).map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="flex items-start">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                            <span>{lesson}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Entendido
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
