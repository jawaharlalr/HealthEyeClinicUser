import React from 'react';
import { UserCheck, Calendar, Clock, FileText, CheckCircle2 } from 'lucide-react';

export default function AppointmentStepper({ currentStep }) {
  const steps = [
    { id: 1, name: 'Patient Type', icon: UserCheck },
    { id: 2, name: 'Select Date', icon: Calendar },
    { id: 3, name: 'Choose Slot', icon: Clock },
    { id: 4, name: 'Patient Details', icon: FileText },
    { id: 5, name: 'Confirmation', icon: CheckCircle2 }
  ];

  return (
    <div className="w-full py-4 mb-8">
      {/* Progress Bar Container */}
      <div className="flex items-center justify-between max-w-4xl mx-auto px-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="flex flex-col items-center group relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    isCompleted
                      ? 'bg-teal-600 text-white shadow-md'
                      : isCurrent
                      ? 'bg-teal-700 text-white ring-4 ring-teal-100 shadow-lg scale-110'
                      : 'bg-slate-100 text-slate-400 border border-slate-200'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 font-medium hidden sm:block text-center max-w-[80px] ${
                    isCurrent ? 'text-teal-800 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-1 mx-2 rounded transition-colors duration-300 ${
                    currentStep > index + 1 ? 'bg-teal-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
