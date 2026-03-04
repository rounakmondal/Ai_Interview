# 🎙️ Enhanced Interview Experience Setup

Your AI Interview platform now supports **realistic, human-like voices** using ElevenLabs AI! This guide will help you set it up.

## ✨ New Features

### 1. **Natural Voice Synthesis**
- Human-like interviewer voice (not robotic!)
- Professional tone and natural pauses
- Multi-language support

### 2. **Echo Cancellation**
- Automatically stops playback before listening
- Prevents microphone from picking up interviewer voice
- Smoother transitions between speaking and listening

### 3. **Improved Speech Recognition**
- Better real-time transcription
- Smooth silence detection (3 seconds)
- Visual feedback while speaking
- No more glitching or state issues

### 4. **Real-Time Visual Feedback**
- Animated wave bars when listening
- Pulsing indicator when interviewer speaks
- Clear status indicators
- Professional interview feel

## 🚀 Quick Setup

### Step 1: Get ElevenLabs API Key (FREE)

1. Go to [https://elevenlabs.io/](https://elevenlabs.io/)
2. Sign up for a **free account** (10,000 characters/month free)
3. Go to your profile → API Keys  
4. Click "Create API Key" and copy it

### Step 2: Add API Key to Your Project

1. Open `.env` file in your project root
2. Replace `your_elevenlabs_api_key_here` with your actual key:

```env
VITE_ELEVENLABS_API_KEY=sk_abc123your_actual_key_here
```

3. Save the file

### Step 3: Restart Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
pnpm dev
```

That's it! Your interview will now use natural AI voices! 🎉

## 💡 How It Works

### With ElevenLabs (Recommended)
- ✅ Natural, human-like voice
- ✅ Professional interview tone
- ✅ Clear pronunciation
- ✅ Better user experience
- ⚠️ Requires API key
- ⚠️ Uses API credits (free tier: 10k chars/month)

### Without ElevenLabs (Fallback)
- ✅ Works without API key
- ✅ No API usage costs
- ❌ Robotic browser voice
- ❌ Less natural experience

The system automatically falls back to browser TTS if:
- API key is not configured
- API request fails
- No internet connection

## 🎯 Best Practices

### For Natural Interview Flow

1. **Test your microphone first**
   - Ensure browser has microphone access
   - Use a quiet environment
   - Headphones recommended to prevent echo

2. **Speak naturally**
   - Pause briefly after speaking (3 seconds)
   - Don't rush between questions
   - Speak clearly

3. **Use Auto Mode**
   - Automatically starts listening after interview question
   - Auto-submits when you stop speaking
   - Most realistic interview experience

### Performance Tips

1. **First question might take 2-3 seconds**
   - API generates audio on-demand
   - Cached for subsequent questions

2. **Internet connection required**
   - For ElevenLabs API
   - Falls back to browser TTS if offline

3. **API Usage**
   - ~100 chars per question
   - Free tier supports ~100 questions/month
   - Monitor usage in ElevenLabs dashboard

## 🔧 Troubleshooting

### "Robotic voice" - ElevenLabs not working?

**Check:**
1. API key is correctly set in `.env`
2. Restart dev server after adding key
3. Check browser console for errors
4. Verify API key is active on ElevenLabs dashboard

### "Echo" - Microphone picking up interviewer?

**Solutions:**
1. Use headphones (recommended)
2. Lower speaker volume  
3. Ensure auto mode is enabled
4. Check browser audio settings

### Speech recognition glitching?

**Solutions:**
1. Use Chrome or Edge (best support)
2. Grant microphone permissions
3. Check for browser updates
4. Try incognito mode to test

### Questions timing out?

**Adjust in code:**
```typescript
// In use-improved-speech.ts
silenceTimeout: 3000, // Increase to 4000-5000 for longer pauses
```

## 📊 API Usage Monitor

Track your usage:
1. Go to [https://elevenlabs.io/](https://elevenlabs.io/)
2. Dashboard → Usage
3. See characters used / remaining

**Free Tier:**
- 10,000 characters/month
- ~100 interview questions
- Resets monthly
- No credit card required

**Paid Plans Start at $5/month:**
- 30,000 characters
- ~300 interviews
- Priority API access
- More voices

## 🎨 Customization

### Change Voice

Edit `client/lib/elevenlabs-tts.ts`:

```typescript
const VOICE_IDS = {
  "en-US": "21m00Tcm4TlvDq8ikWAM", // Rachel (default)
  // Try other voices:
  // "pNInz6obpgDQGcFmaJgB", // Adam - deep male
  // "EXAVITQu4vr4xnSDxMaL", // Bella - soft female
};
```

Browse voices: [ElevenLabs Voice Library](https://elevenlabs.io/voice-library)

### Adjust Speech Speed/Tone

In `elevenlabs-tts.ts`:

```typescript
stability: 0.5,        // 0-1: Higher = more consistent
similarityBoost: 0.75, // 0-1: Higher = more like original
style: 0.3,            // 0-1: Higher = more expressive
```

### Change Silence Timeout

In `InterviewRoom.tsx`:

```typescript
const speech = useImprovedSpeech({
  silenceTimeout: 3000, // milliseconds (default: 3000)
});
```

## 🎯 Production Deployment

### Environment Variables

Set on your hosting platform:

**Netlify:**
```
Site settings → Environment Variables
Key: VITE_ELEVENLABS_API_KEY
Value: your_api_key
```

**Vercel:**
```
Project settings → Environment Variables
VITE_ELEVENLABS_API_KEY=your_api_key
```

**Docker:**
```dockerfile
ENV VITE_ELEVENLABS_API_KEY=your_api_key
```

### Security Notes

- ✅ API key is prefixed with `VITE_` (safe for client-side)
- ✅ ElevenLabs API is rate-limited per key
- ⚠️ Don't commit `.env` file to Git
- ⚠️ Rotate keys if exposed

## 🆘 Need Help?

1. **Check browser console** for error messages
2. **Test microphone** in browser settings
3. **Verify API key** on ElevenLabs dashboard
4. **Try fallback** by removing API key temporarily

## 🚀 Next Steps

- ✅ Configure ElevenLabs API key
- ✅ Test first interview
- ✅ Adjust timing if needed
- ✅ Monitor API usage
- 🎯 Enjoy realistic interviews!

---

**Pro Tip:** The first question might take 2-3 seconds while audio generates. After that, it's instant! The natural voice is worth the tiny wait. 🎉
