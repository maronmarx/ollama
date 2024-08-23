import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const apiPath = '/app/config.json'
    const data = JSON.parse(fs.readFileSync(apiPath, 'utf8'));
    
    return NextResponse.json({ notifications: data.notifications || [] });
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur lors de la récupération des notifications"
    }, { status: 500 });
  }
}