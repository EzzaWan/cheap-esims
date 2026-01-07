"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, AlertTriangle, Search, Globe, ExternalLink, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { safeFetch } from "@/lib/safe-fetch";

interface Country {
  code: string;
  name: string;
}

interface DeviceCompatibility {
  model: string;
  brand: string;
  supported: boolean;
  notes: string[];
  regionalNotes: Record<string, string>;
}

export default function DeviceCheckPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
  const [deviceQuery, setDeviceQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DeviceCompatibility | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const data = await safeFetch<any>(`${apiUrl}/countries`, { showToast: false });
        // Handle both array and { locationList: [...] } formats
        const countriesArray = Array.isArray(data) ? data : (data.locationList || []);
        setCountries(countriesArray.map((c: any) => ({ code: c.code, name: c.name || c.code })));
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      }
    };
    fetchCountries();
  }, [apiUrl]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (deviceQuery.length < 2) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }

      try {
        const data = await safeFetch<{ models: string[] }>(`${apiUrl}/device/models?q=${encodeURIComponent(deviceQuery)}`, { showToast: false });
        setSuggestions(data.models || []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [deviceQuery, apiUrl]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCheckCompatibility = async () => {
    if (!selectedDevice) {
      alert("Please select a device model");
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ model: selectedDevice });
      if (selectedCountry) {
        params.append("country", selectedCountry);
      }

      const data = await safeFetch<DeviceCompatibility>(`${apiUrl}/device/check?${params.toString()}`, {
        errorMessage: "Failed to check device compatibility. Please try again.",
      });
      setResult(data);
      if (selectedDevice) {
        localStorage.setItem('deviceModel', selectedDevice);
      }
    } catch (error) {
      console.error("Failed to check compatibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (model: string) => {
    setSelectedDevice(model);
    setDeviceQuery(model);
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-4xl mx-auto py-10 px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black mb-2">Device Compatibility Checker</h1>
          <p className="text-gray-500">
            Check if your device supports eSIM before purchasing
          </p>
        </div>

        <Card className="bg-white border-gray-200 mb-6 shadow-sm">
          <CardHeader>
            <CardTitle className="text-black">Search Your Device</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative" ref={suggestionsRef}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="e.g., iPhone 15, Samsung Galaxy S24..."
                  value={deviceQuery}
                  onChange={(e) => {
                    setDeviceQuery(e.target.value);
                    setSelectedDevice("");
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) setShowSuggestions(true);
                  }}
                  className="pl-10 bg-white border-gray-200 text-black placeholder:text-gray-400"
                />
              </div>
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {suggestions.map((model) => (
                    <button
                      key={model}
                      onClick={() => handleSuggestionClick(model)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-black transition-colors"
                    >
                      {model}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCountry}
                onChange={(e) => setSelectedCountry(e.target.value)}
                className="w-full h-10 pl-10 pr-3 rounded-md border border-gray-200 bg-white text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <option value="">Select country (optional)</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
            </div>

            <Button
              onClick={handleCheckCompatibility}
              disabled={!selectedDevice || loading}
              className="w-full bg-primary hover:bg-primary/90 text-black font-bold"
            >
              {loading ? "Checking..." : "Check Compatibility"}
            </Button>
          </CardContent>
        </Card>

        {result && (
          <Card className="bg-white border-gray-200 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-black">Compatibility Result</CardTitle>
                <Badge
                  className={
                    result.supported
                      ? "bg-green-100 text-green-700 border-green-200"
                      : "bg-red-100 text-red-700 border-red-200"
                  }
                >
                  {result.supported ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-1 inline" />
                      SUPPORTED
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 mr-1 inline" />
                      NOT SUPPORTED
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Device</p>
                <p className="text-lg font-semibold text-black">
                  {result.brand} {result.model}
                </p>
              </div>

              {result.notes && result.notes.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Important Notes</p>
                  <div className="space-y-2">
                    {result.notes.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 p-3 bg-gray-50 rounded-md border border-gray-200"
                      >
                        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">{note}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCountry && result.regionalNotes?.[selectedCountry.toUpperCase()] && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Country-Specific Information</p>
                  <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-sm text-yellow-700">
                      {result.regionalNotes[selectedCountry.toUpperCase()]}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                {result.supported ? (
                  <>
                    <Link href="/countries">
                      <Button variant="outline" className="border-gray-300 text-black hover:bg-gray-50">
                        Browse Plans
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/support">
                      <Button variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                        View Installation Guide
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/support">
                    <Button variant="secondary" className="bg-gray-100 text-gray-900 hover:bg-gray-200">
                      Contact Support
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
