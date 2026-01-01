import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normaliseVrm(input: string) {
  return input.replace(/\s+/g, "").toUpperCase().trim();
}

// Safe getter for nested objects
function get(obj: any, path: (string | number)[]) {
  return path.reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : undefined), obj);
}

// Make a clean-ish title for display
function titleCase(s: any) {
  if (!s || typeof s !== "string") return null;
  const cleaned = s.trim().toLowerCase();
  if (!cleaned) return null;
  return cleaned.replace(/\b[a-z]/g, (m) => m.toUpperCase());
}

function buildSummary(payload: any) {
  // Your payload is the raw "vehicle" object from the provider
  const vi =
    get(payload, ["Results", "VehicleDetails", "VehicleIdentification"]) ??
    get(payload, ["results", "vehicleDetails", "vehicleIdentification"]) ??
    null;

  const vhColour =
    get(payload, ["Results", "VehicleDetails", "VehicleHistory", "ColourDetails", "CurrentColour"]) ??
    get(payload, ["Results", "VehicleDetails", "VehicleHistory", "ColourDetails", "currentColour"]) ??
    null;

  const make =
    titleCase(get(vi, ["DvlaMake"]) ?? get(vi, ["dvlaMake"]) ?? get(payload, ["Results", "ModelDetails", "ModelIdentification", "Make"])) ??
    null;

  const modelRaw =
    get(vi, ["DvlaModel"]) ??
    get(vi, ["dvlaModel"]) ??
    get(payload, ["Results", "ModelDetails", "ModelIdentification", "Model"]) ??
    null;

  const model = titleCase(modelRaw);

  const year =
    get(vi, ["YearOfManufacture"]) ??
    get(vi, ["yearOfManufacture"]) ??
    null;

  const fuelType =
    titleCase(get(vi, ["DvlaFuelType"]) ?? get(vi, ["dvlaFuelType"]) ?? get(payload, ["Results", "ModelDetails", "Powertrain", "FuelType"])) ??
    null;

  const colour = titleCase(vhColour) ?? null;

  const providerStatus =
    get(payload, ["ResponseInformation", "StatusCode"]) ??
    get(payload, ["responseInformation", "statusCode"]) ??
    null;

  const providerMessage =
    get(payload, ["ResponseInformation", "StatusMessage"]) ??
    get(payload, ["responseInformation", "statusMessage"]) ??
    null;

  return {
    make,
    model,
    year: typeof year === "number" ? year : year ? Number(year) : null,
    colour,
    fuelType,
    providerStatus,
    providerMessage,
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const vrmRaw = body?.vrm;

    if (!vrmRaw || typeof vrmRaw !== "string") {
      return NextResponse.json({ ok: false, error: "Vehicle registration is required" }, { status: 400 });
    }

    const API_KEY = process.env.VEHICLE_DATA_GLOBAL_API_KEY;
    const ENDPOINT = process.env.VEHICLE_DATA_GLOBAL_ENDPOINT;
    const PACKAGE = process.env.VEHICLE_DATA_GLOBAL_PACKAGE;

    if (!API_KEY || !ENDPOINT || !PACKAGE) {
      return NextResponse.json(
        { ok: false, error: "Server misconfigured (missing Vehicle Data Global env vars)" },
        { status: 500 }
      );
    }

    const VRM = normaliseVrm(vrmRaw);

    if (VRM.length < 5 || VRM.length > 8) {
      return NextResponse.json({ ok: false, error: "Please enter a valid registration number" }, { status: 400 });
    }

    const url =
      `${ENDPOINT}` +
      `?apiKey=${encodeURIComponent(API_KEY)}` +
      `&packageName=${encodeURIComponent(PACKAGE)}` +
      `&vrm=${encodeURIComponent(VRM)}`;

    const res = await fetch(url, {
      method: "GET",
      cache: "no-store",
      headers: { accept: "application/json" },
    });

    const text = await res.text();
    let providerData: any = null;

    try {
      providerData = JSON.parse(text);
    } catch {
      providerData = { raw: text };
    }

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: "Vehicle lookup failed",
          status: res.status,
          providerMessage: providerData?.ResponseInformation?.StatusMessage ?? providerData?.responseInformation?.statusMessage ?? undefined,
        },
        { status: 502 }
      );
    }

    const summary = buildSummary(providerData);

    return NextResponse.json({
      ok: true,
      vrm: VRM,
      vehicle: providerData, // full raw payload (for debugging / future use)
      summary,               // ✅ what the UI should use
    });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: "Unexpected server error", message: err?.message ?? String(err) },
      { status: 500 }
    );
  }
}
