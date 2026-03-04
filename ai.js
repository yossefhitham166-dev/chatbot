/**
 * ai.js — Groq AI Integration
 * Handles sending messages to Groq and returning AI responses
 */

require("dotenv").config();
const Groq = require("groq-sdk");
const config = require("./config");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// In-memory store for conversation history per contact
// Key = phone number, Value = array of {role, content} messages
const conversationHistory = new Map();

/**
 * Get or create conversation history for a contact
 */
function getHistory(contactId) {
    if (!conversationHistory.has(contactId)) {
        conversationHistory.set(contactId, []);
    }
    return conversationHistory.get(contactId);
}

/**
 * Add a message to conversation history, trimming old ones if needed
 */
function addToHistory(contactId, role, content) {
    const history = getHistory(contactId);
    history.push({ role, content });

    // Keep only the last N messages to avoid token limits
    if (history.length > config.MAX_HISTORY) {
        history.splice(0, history.length - config.MAX_HISTORY);
    }
}

/**
 * Generate an AI reply for a given message and contact
 * @param {string} contactId - Unique ID (phone number) of the sender
 * @param {string} userMessage - The message they sent
 * @returns {Promise<string>} - The AI-generated reply
 */
async function generateReply(contactId, userMessage) {
    try {
        // Add their message to history
        addToHistory(contactId, "user", userMessage);

        const history = getHistory(contactId);

        const response = await groq.chat.completions.create({
            model: config.MODEL,
            max_tokens: config.MAX_TOKENS,
            temperature: config.TEMPERATURE,
            messages: [
                { role: "system", content: config.SYSTEM_PROMPT },
                ...history,
            ],
        });

        const reply = response.choices[0]?.message?.content?.trim();

        if (!reply) {
            throw new Error("Empty response from Groq");
        }

        // Add the AI's reply to history for context in future messages
        addToHistory(contactId, "assistant", reply);

        return reply;
    } catch (error) {
        console.error("[AI Error]", error.message);
        return null; // Return null so bot.js can handle it gracefully
    }
}

/**
 * Clear conversation history for a contact (e.g. after long inactivity)
 */
function clearHistory(contactId) {
    conversationHistory.delete(contactId);
}

module.exports = { generateReply, clearHistory };
