/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Globe, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { type Comment } from '../types';
import { translateText } from '../services/geminiService';
import { cn } from '../lib/utils';

interface CommentWidgetProps {
  comment: Comment;
}

export const CommentWidget: React.FC<CommentWidgetProps> = ({ comment }) => {
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showOriginal, setShowOriginal] = useState(true);

  // For this demo, we assume user's language is 'zh' (Chinese)
  const userLanguage = 'zh';
  const canTranslate = comment.language !== userLanguage;

  const handleTranslate = async () => {
    if (translatedText) {
      setShowOriginal(!showOriginal);
      return;
    }

    setIsTranslating(true);
    try {
      const result = await translateText(comment.text, comment.language, userLanguage);
      setTranslatedText(result);
      setShowOriginal(false);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm border border-natural-orange/20 relative group">
      <div className="flex justify-between mb-1">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-natural-orange rounded-full flex items-center justify-center text-[10px]">
            {comment.user.charAt(0)}
          </div>
          <span className="text-[11px] font-bold text-natural-accent">{comment.user}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-[#A89078]">{comment.timestamp}</span>
          {canTranslate && (
            <button 
              onClick={handleTranslate}
              disabled={isTranslating}
              className={cn(
                "p-1.5 rounded-lg transition-colors hover:bg-natural-orange/20 text-natural-accent",
                isTranslating && "animate-pulse"
              )}
              title="翻译到中文"
            >
              {isTranslating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Globe className={cn("w-3 h-3", !showOriginal && "text-natural-dark")} />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-1">
        <AnimatePresence mode="wait">
          {showOriginal ? (
            <motion.p 
              key="original"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs leading-normal"
            >
              {comment.text}
            </motion.p>
          ) : (
            <motion.div
              key="translated"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-1"
            >
              <p className="text-xs leading-normal text-natural-dark font-medium">
                {translatedText}
              </p>
              <div className="text-[9px] text-natural-accent italic opacity-60 flex items-center gap-1">
                <div className="w-1 h-1 bg-natural-accent rounded-full" />
                由 PawAtlas AI 自动翻译
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
