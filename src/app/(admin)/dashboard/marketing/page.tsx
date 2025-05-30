"use client";

import { getSubscribers } from "@/app/lib/prisma";
import { sendNewsletter, sendTestEmail } from "@/app/actions/newsletter";
import { createTemplate, getTemplates, deleteTemplate, ensureWelcomeTemplate, updateTemplate } from "@/app/lib/actions/templates";
import { useEffect, useState } from "react";

interface Subscriber {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Subscribers() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newsletterContent, setNewsletterContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isCreatingTemplate, setIsCreatingTemplate] = useState(false);
  const [templateName, setTemplateName] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);

  // Fetch subscribers and templates on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Ensure welcome template exists
      await ensureWelcomeTemplate();
      
      const [subscribersData, templatesData] = await Promise.all([
        getSubscribers(),
        getTemplates()
      ]);
      setSubscribers(subscribersData);
      setTemplates(templatesData);
    };
    fetchData();
  }, []);

  const handleCreateTemplate = async () => {
    if (!templateName || !subject || !newsletterContent) return;
    
    try {
      const template = await createTemplate(templateName, subject, newsletterContent);
      setTemplates([template, ...templates]);
      setSuccess("Template created successfully!");
      setIsCreatingTemplate(false);
      setTemplateName("");
    } catch (error) {
      setError("Failed to create template. Please try again.");
      console.error("Failed to create template:", error);
    }
  };

  const handleDeleteTemplate = async (id: string, name: string) => {
    if (name === 'signedup') {
      setError("Cannot delete the welcome template as it is a system template.");
      return;
    }

    try {
      await deleteTemplate(id);
      setTemplates(templates.filter(t => t.id !== id));
      setSuccess("Template deleted successfully!");
    } catch (error) {
      setError("Failed to delete template. Please try again.");
      console.error("Failed to delete template:", error);
    }
  };

  const handleLoadTemplate = (template: EmailTemplate) => {
    setSubject(template.subject);
    setNewsletterContent(template.content);
  };

  const handleEditTemplate = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setSubject(template.subject);
    setNewsletterContent(template.content);
    setTemplateName(template.name);
  };

  const handleSaveEdit = async () => {
    if (!editingTemplate || !subject || !newsletterContent) return;

    try {
      const updatedTemplate = await updateTemplate(
        editingTemplate.id,
        editingTemplate.name,
        subject,
        newsletterContent
      );
      
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id ? updatedTemplate : t
      ));
      
      setSuccess("Template updated successfully!");
      setEditingTemplate(null);
      setTemplateName("");
    } catch (error) {
      setError("Failed to update template. Please try again.");
      console.error("Failed to update template:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingTemplate(null);
    setTemplateName("");
    setSubject("");
    setNewsletterContent("");
  };

  const handleSendNewsletter = async () => {
    setIsSending(true);
    setError(null);
    setSuccess(null);
    try {
      const recipientEmails = subscribers.map(sub => sub.email);
      await sendNewsletter(subject, newsletterContent, recipientEmails);
      setSuccess(`Newsletter sent successfully to ${subscribers.length} subscribers!`);
    } catch (error) {
      setError("Failed to send newsletter. Please try again.");
      console.error("Failed to send newsletter:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;
    setIsSending(true);
    setError(null);
    setSuccess(null);
    try {
      await sendTestEmail(testEmail, subject, newsletterContent);
      setSuccess("Test email sent successfully!");
    } catch (error) {
      setError("Failed to send test email. Please try again.");
      console.error("Failed to send test email:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Newsletter Management</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Subscribers</h2>
        <div className="bg-white p-4 rounded-lg shadow">
          <p className="text-lg font-medium">{subscribers.length} total subscribers</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Email Templates</h2>
          {!editingTemplate && (
            <button
              onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              {isCreatingTemplate ? "Cancel" : "Create New Template"}
            </button>
          )}
        </div>

        {(isCreatingTemplate || editingTemplate) && (
          <div className="mb-4">
            <input
              type="text"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              placeholder="Template Name"
              className="w-full p-2 border border-gray-300 rounded-md mb-2"
              disabled={editingTemplate?.name === 'signedup'}
            />
            <div className="flex space-x-2">
              <button
                onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}
                disabled={!templateName || !subject || !newsletterContent}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingTemplate ? "Save Changes" : "Save Template"}
              </button>
              {editingTemplate && (
                <button
                  onClick={handleCancelEdit}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.length === 0 ? (
            <div className="col-span-full bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first email template to save and reuse your newsletter designs.
              </p>
              <button
                onClick={() => setIsCreatingTemplate(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Create Your First Template
              </button>
            </div>
          ) : (
            templates.map((template) => (
              <div key={template.id} className="bg-white p-4 rounded-lg shadow">
                <h3 className="font-medium mb-2">
                  {template.name}
                  {template.name === 'signedup' && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      System Template
                    </span>
                  )}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{template.subject}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleLoadTemplate(template)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Load
                  </button>
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
                  >
                    Edit
                  </button>
                  {template.name !== 'signedup' && (
                    <button
                      onClick={() => handleDeleteTemplate(template.id, template.name)}
                      className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="Enter newsletter subject"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Newsletter Content (HTML)
          </label>
          <div className="border border-gray-300 rounded-md">
            <div className="border-b border-gray-300 p-2 bg-gray-50">
              <span className="text-sm text-gray-500">You can use HTML and CSS directly in the editor</span>
            </div>
            <textarea
              value={newsletterContent}
              onChange={(e) => setNewsletterContent(e.target.value)}
              className="w-full h-64 p-4 focus:outline-none font-mono text-sm"
              placeholder="<div style='color: blue;'>Write your newsletter content here...</div>"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Test Email Address
            </label>
            <input
              type="email"
              value={testEmail}
              onChange={(e) => setTestEmail(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter email for test"
            />
          </div>
          <button
            onClick={handleSendTestEmail}
            disabled={isSending || !testEmail || !subject || !newsletterContent}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            Send Test
          </button>
        </div>

        <button
          onClick={handleSendNewsletter}
          disabled={isSending || !subject || !newsletterContent}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSending ? "Sending..." : "Send Newsletter"}
        </button>
      </div>
    </div>
  );
}