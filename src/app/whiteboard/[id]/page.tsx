'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import WhiteboardCanvas from '@/components/whiteboard/WhiteboardCanvas';
import {
  ArrowLeft,
  Users,
  Sparkles
} from 'lucide-react';

interface WhiteboardData {
  id: string;
  title: string;
  description?: string;
  content?: any;
  template?: any;
  collaborators: string[];
  isPublic: boolean;
}

const WhiteboardEditorPage = () => {
  const params = useParams();
  const whiteboardId = params.id as string;

  const [whiteboard, setWhiteboard] = useState<WhiteboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCollaborators, setShowCollaborators] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  // Editable title/desc state
  const [title, setTitle] = useState('Untitled Whiteboard');
  const [desc, setDesc] = useState('Add a description');
  const titleInputRef = useRef<HTMLInputElement>(null);
  const descInputRef = useRef<HTMLInputElement>(null);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDesc, setEditingDesc] = useState(false);

  // Fetch whiteboard data
  useEffect(() => {
    const fetchWhiteboard = async () => {
      try {
        const response = await fetch(`/api/whiteboards/${whiteboardId}`);
        if (response.ok) {
          const data = await response.json();
          setWhiteboard(data);
          setTitle(data.title || 'Untitled Whiteboard');
          setDesc(data.description || 'Add a description');
        } else {
          setWhiteboard({
            id: whiteboardId,
            title: 'Untitled Whiteboard',
            description: 'Add a description',
            content: null,
            template: null,
            collaborators: ['user1', 'user2', 'user3'],
            isPublic: false,
          });
        }
      } catch (error) {
        setWhiteboard({
          id: whiteboardId,
          title: 'Untitled Whiteboard',
          description: 'Add a description',
          content: null,
          template: null,
          collaborators: ['user1', 'user2', 'user3'],
          isPublic: false,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchWhiteboard();
  }, [whiteboardId]);

  const handleSave = (data: any) => {
    console.log('Saving whiteboard:', data);
    // Implement save functionality
  };

  const handleShare = () => {
    console.log('Sharing whiteboard');
    // Implement share functionality
  };

  const handleAISubmit = () => {
    console.log('AI Prompt:', aiPrompt);
    // Implement AI functionality
    setAiPrompt('');
  };

  const handleEndSession = () => {
    // Save current state before ending session
    if (whiteboard) {
      // You can implement auto-save here
      console.log('Ending session and saving whiteboard');
    }
    // Navigate back to dashboard
    window.location.href = '/dashboard';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading whiteboard...</p>
        </div>
      </div>
    );
  }

  if (!whiteboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Whiteboard not found</h2>
          <p className="text-gray-600">The whiteboard you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg" onClick={() => window.location.href = '/whiteboard/new'}>
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              {/* Editable Title */}
              {editingTitle ? (
                <input
                  ref={titleInputRef}
                  className="text-xl font-semibold text-gray-900 bg-white border-b border-blue-400 outline-none px-1"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  onBlur={() => setEditingTitle(false)}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingTitle(false); }}
                  autoFocus
                  maxLength={64}
                />
              ) : (
                <h1
                  className="text-xl font-semibold text-gray-900 cursor-pointer hover:underline"
                  onClick={() => setEditingTitle(true)}
                  title="Click to edit title"
                >
                  {title || 'Untitled Whiteboard'}
                </h1>
              )}
              {/* Editable Description */}
              {editingDesc ? (
                <input
                  ref={descInputRef}
                  className="text-sm text-gray-600 bg-white border-b border-blue-200 outline-none px-1 mt-1"
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  onBlur={() => setEditingDesc(false)}
                  onKeyDown={e => { if (e.key === 'Enter') setEditingDesc(false); }}
                  autoFocus
                  maxLength={128}
                />
              ) : (
                <p
                  className="text-sm text-gray-600 cursor-pointer hover:underline mt-1"
                  onClick={() => setEditingDesc(true)}
                  title="Click to edit description"
                >
                  {desc || 'Add a description'}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Collaboration Status */}
            <div className="flex items-center space-x-1 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{whiteboard.collaborators.length} collaborators</span>
            </div>

            {/* Simplified Action Buttons */}
            <button
              onClick={() => setShowAI(!showAI)}
              className="p-2 hover:bg-gray-100 rounded-lg"
              title="AI Assistant"
            >
              <Sparkles className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* AI Assistant Panel */}
      {showAI && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center space-x-4">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <div className="flex-1">
              <input
                type="text"
                placeholder="Ask AI to help with your whiteboard..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && handleAISubmit()}
              />
            </div>
            <button
              onClick={handleAISubmit}
              className="btn btn-primary"
            >
              Ask AI
            </button>
          </div>
        </div>
      )}

      {/* Collaborators Panel */}
      {showCollaborators && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">Collaborators</h3>
            <button className="btn btn-primary text-sm">
              Invite
            </button>
          </div>
          <div className="mt-3 space-y-2">
            {whiteboard.collaborators.map((collaborator, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {collaborator.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-900">{collaborator}</span>
                </div>
                <span className="text-xs text-gray-500">Online</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 overflow-hidden">
        <WhiteboardCanvas
          initialData={whiteboard.content}
          template={whiteboard.template}
          onSave={handleSave}
          onShare={handleShare}
          isCollaborative={whiteboard.collaborators.length > 1}
          onEndSession={handleEndSession}
          whiteboardTitle={title}
        />
      </div>


    </div>
  );
};

export default WhiteboardEditorPage; 