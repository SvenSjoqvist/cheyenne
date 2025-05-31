"use client";

import { getSubscribers } from "@/app/lib/prisma";
import { sendNewsletter, sendTestEmail } from "@/app/actions/newsletter";
import { createTemplate, getTemplates, deleteTemplate, ensureWelcomeTemplate, updateTemplate } from "@/app/lib/actions/templates";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Newsletter Management</h1>
        <div className="flex items-center space-x-4">
          <div className="bg-white px-4 py-2 rounded-lg shadow-sm">
            <span className="text-sm text-gray-600">Total Subscribers</span>
            <p className="text-2xl font-bold text-blue-600">{subscribers.length}</p>
          </div>
        </div>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Compose Newsletter</CardTitle>
          </CardHeader>
          <CardContent>
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
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isSending ? "Sending..." : "Send Newsletter to All Subscribers"}
              </button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Email Templates</CardTitle>
                {!editingTemplate && (
                  <button
                    onClick={() => setIsCreatingTemplate(!isCreatingTemplate)}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-md hover:bg-green-700"
                  >
                    {isCreatingTemplate ? "Cancel" : "New Template"}
                  </button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {(isCreatingTemplate || editingTemplate) && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
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
                      className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingTemplate ? "Save Changes" : "Save Template"}
                    </button>
                    {editingTemplate && (
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {templates.length === 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg text-center">
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
                    <div key={template.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">
                          {template.name}
                          {template.name === 'signedup' && (
                            <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              System
                            </span>
                          )}
                        </h3>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => handleLoadTemplate(template)}
                            className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded hover:bg-blue-200"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded hover:bg-yellow-200"
                          >
                            Edit
                          </button>
                          {template.name !== 'signedup' && (
                            <button
                              onClick={() => handleDeleteTemplate(template.id, template.name)}
                              className="px-2 py-1 bg-red-100 text-red-600 text-xs rounded hover:bg-red-200"
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{template.subject}</p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}