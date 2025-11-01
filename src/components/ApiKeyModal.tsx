import React, { useState, useEffect } from 'react';
import { useConfigStore } from '@stores/configStore';

/**
 * Modal popup for OpenAI API Key configuration
 * Appears on first load if no API key is configured
 * Blocks access to the app until a valid key is provided
 */
export const ApiKeyModal: React.FC = () => {
  const { apiKey, setApiKey, isApiKeyValid, validateApiKey } = useConfigStore();
  const [inputKey, setInputKey] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Show modal if no valid API key is stored
    if (!isApiKeyValid) {
      setShowModal(true);
    }
  }, [isApiKeyValid]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsValidating(true);

    try {
      // Validate the API key format
      if (!inputKey.startsWith('sk-')) {
        throw new Error('La clé API doit commencer par "sk-"');
      }

      if (inputKey.length < 20) {
        throw new Error('La clé API semble trop courte');
      }

      // Test the API key with a simple request
      const isValid = await validateApiKey(inputKey);

      if (isValid) {
        setApiKey(inputKey);
        setShowModal(false);
      } else {
        throw new Error('Clé API invalide. Veuillez vérifier votre clé OpenAI.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur de validation');
    } finally {
      setIsValidating(false);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 backdrop-blur-sm">
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-cyan-500 rounded-2xl shadow-2xl p-8 max-w-2xl w-full mx-4 animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-cyan-500 bg-opacity-20 rounded-full mb-4">
            <svg
              className="w-16 h-16 text-cyan-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
              />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">🎹 DawlessStudio</h1>
          <p className="text-cyan-400 text-lg">Configuration requise</p>
        </div>

        {/* Warning Box */}
        <div className="bg-yellow-500 bg-opacity-10 border border-yellow-500 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <svg
              className="w-6 h-6 text-yellow-400 mr-3 flex-shrink-0 mt-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-yellow-400 font-semibold mb-1">
                Clé API OpenAI requise
              </h3>
              <p className="text-gray-300 text-sm">
                DawlessGPT nécessite une clé API OpenAI valide pour fonctionner. Sans cette
                clé, l'assistant IA ne pourra pas vous aider dans votre création musicale.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
              Clé API OpenAI
            </label>
            <input
              type="password"
              id="apiKey"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="sk-..."
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
              disabled={isValidating}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-red-400 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                {error}
              </p>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-blue-500 bg-opacity-10 border border-blue-500 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              Comment obtenir une clé API ?
            </h4>
            <ol className="text-sm text-gray-300 space-y-1 ml-7 list-decimal">
              <li>
                Rendez-vous sur{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:text-cyan-300 underline"
                >
                  platform.openai.com/api-keys
                </a>
              </li>
              <li>Connectez-vous ou créez un compte OpenAI</li>
              <li>Cliquez sur "Create new secret key"</li>
              <li>Copiez la clé et collez-la ci-dessus</li>
            </ol>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isValidating || !inputKey}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-lg shadow-lg transform transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isValidating ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Validation en cours...
              </span>
            ) : (
              'Valider et continuer'
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            🔒 Votre clé API est stockée localement et de manière sécurisée dans votre
            navigateur. Elle n'est jamais envoyée à nos serveurs.
          </p>
        </div>
      </div>
    </div>
  );
};
