"use client";

import { sendNewsletter, sendTestEmail } from "@/app/actions/newsletter";
import { createTemplate, getTemplates, deleteTemplate, ensureWelcomeTemplate, updateTemplate } from "@/app/lib/actions/templates";
import { useEffect, useState } from "react";
import { useDashboard } from "@/app/components/admin/DashboardContext";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function Subscribers() {
  const { data } = useDashboard();
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [newsletterContent, setNewsletterContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [templateName, setTemplateName] = useState("");
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch templates on component mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoading(true);
        // Ensure welcome template exists
        await ensureWelcomeTemplate();
        
        const templatesData = await getTemplates();
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
        setError('Failed to load templates');
      } finally {
        setLoading(false);
      }
    };
    fetchTemplates();
  }, []);

  const handleCreateTemplate = async () => {
    if (!templateName || !subject || !newsletterContent) return;
    
    try {
      const template = await createTemplate(templateName, subject, newsletterContent);
      setTemplates([template, ...templates]);
      setSuccess("Template created successfully!");
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
      // Get subscriber emails from the dashboard data
      const recipientEmails = data.marketing.subscribers?.map(sub => sub.email) || [];
      
      if (recipientEmails.length === 0) {
        throw new Error('No subscribers found to send the newsletter to');
      }

      await sendNewsletter(subject, newsletterContent, recipientEmails);
      setSuccess(`Newsletter sent successfully to ${recipientEmails.length} subscribers!`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to send newsletter. Please try again.");
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl">Loading marketing data...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 sm:px-7">
      <div className="pt-8 sm:pt-16 bg-white min-h-screen">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-2 justify-center items-center mb-6">
            <h1 className="text-[32px] sm:text-[40px] font-darker-grotesque tracking-wider font-regular">Marketing</h1>
          </div>
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex flex-col gap-4 w-full">
              <h2 className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-semibold">Compose Newsletter</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md max-w-[447px]"
                  placeholder="Enter newsletter subject"
                />
              </div>

              <div>
                <label className="block text-[#212121] font-semibold text-[16px] sm:text-[18px] mb-2 font-darker-grotesque">
                  Newsletter Content (HTML)
                </label>
                <label className="text-[14px] sm:text-[16px] text-[#212121] font-darker-grotesque font-regular">You can use HTML and CSS directly in the editor</label>
                <div className="border border-gray-300 rounded-md mt-3 max-w-[447px]">
                  <textarea
                    value={newsletterContent}
                    onChange={(e) => setNewsletterContent(e.target.value)}
                    className="w-full h-48 sm:h-64 p-4 focus:outline-none font-mono text-sm"
                    placeholder="<div style='color: blue;'>Write your newsletter content here...</div>"
                  />
                </div>
              </div>

              <label className="block text-[#212121] font-semibold text-[16px] sm:text-[18px] font-darker-grotesque">
                Email Address
              </label>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full">
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md max-w-[447px]"
                  placeholder="Enter email for test"
                />
                <button
                  onClick={handleSendTestEmail}
                  disabled={isSending || !testEmail || !subject || !newsletterContent}
                  className="w-full sm:w-auto px-8 py-2 bg-[#212121] text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Test
                </button>
              </div>

              <button
                onClick={handleSendNewsletter}
                disabled={isSending || !subject || !newsletterContent}
                className="w-full px-4 py-3 bg-[#212121] text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium max-w-[447px]" 
              >
                {isSending ? "Sending..." : "Send Newsletter to All Subscribers"}
              </button>
            </div>

            <div className="flex flex-col gap-4 w-full max-w-[447px] mb-96">
              <div className="flex flex-col sm:flex-row gap-4 border border-gray-300 rounded-lg">
                <h2 className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-semibold border-b-2 sm:border-b-0 sm:border-r-2 border-gray-300 p-4">Total subscribers</h2>
                <p className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-regular p-4">{data.marketing.subscribersCount}</p>
              </div>

              <h3 className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-semibold">Email Templates</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#212121] font-semibold text-[16px] sm:text-[18px] font-darker-grotesque">Template Name</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="Save template"
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>

                <button
                  onClick={editingTemplate ? handleSaveEdit : handleCreateTemplate}
                  disabled={!templateName || !subject || !newsletterContent}
                  className="w-full px-4 py-3 bg-[#212121] text-white rounded-md hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed font-medium"
                >
                  {editingTemplate ? "Save Changes" : "Save Template"}
                </button>

                {editingTemplate && (
                  <>
                    <button
                      onClick={handleCancelEdit}
                      className="w-full px-4 py-3 bg-gray-500 text-white rounded-md hover:bg-gray-600 font-medium"
                    >
                      Cancel Edit
                    </button>
                    {editingTemplate.name !== 'signedup' && (
                      <button
                        onClick={() => handleDeleteTemplate(editingTemplate.id, editingTemplate.name)}
                        className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 font-medium"
                      >
                        Delete Template
                      </button>
                    )}
                  </>
                )}

                <div className="space-y-3">
                  {templates.length === 0 ? (
                    <div className="flex flex-col sm:flex-row gap-4 border border-gray-300 rounded-lg p-4">
                      <h2 className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-semibold border-b-2 sm:border-b-0 sm:border-r-2 border-gray-300 pr-4 py-2">
                        No Templates
                      </h2>
                    </div>
                  ) : (
                    templates.map((template) => (
                      <div key={template.id} className="flex flex-col sm:flex-row gap-4 border border-gray-300 rounded-lg">
                        <div className="border-b-2 sm:border-b-0 sm:border-r-2 border-gray-300 p-4 w-full sm:w-3/4"> 
                          <h2 className="text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-semibold">
                            {template.name}
                            {template.name === 'signedup' && (
                              <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                System
                              </span>
                            )}
                          </h2>
                        </div>
                        <div className="flex justify-center sm:justify-end p-4">
                          <button
                            onClick={() => handleLoadTemplate(template)}
                            className="text-black cursor-pointer text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-regular"
                          >
                            Load
                          </button>
                          <button
                            onClick={() => handleEditTemplate(template)}
                            className="text-black cursor-pointer text-[22px] sm:text-[26px] font-darker-grotesque tracking-wider font-regular px-2"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
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
    </div>
  );
}