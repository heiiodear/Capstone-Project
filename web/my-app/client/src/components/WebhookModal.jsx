import React from "react";

function WebhookModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 px-4">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold cursor-pointer"
                    aria-label="Close"
                >
                    ✕
                </button>

                <h2 className="text-lg font-semibold text-indigo-900">
                    How to Create and Get Your Discord Webhook URL
                </h2>

                <p className="text-sm text-gray-700">
                    To receive fall detection notifications via Discord, follow these steps to create a Webhook URL from your server:
                </p>

                <h4 className="font-medium text-indigo-900">Step 1: Open Your Discord Server</h4>
                <p className="text-sm text-gray-700">
                    • Go to your Discord app (desktop or web). <br />
                    • Select the server where you want to receive the fall notifications.
                </p>

                <h4 className="font-medium text-indigo-900">Step 2: Access Channel Settings</h4>
                <p className="text-sm text-gray-700">
                    • Choose the text channel where you want the notifications to appear (e.g., #fall-alerts). <br />
                    • Click the setting icon next to the channel name to open Channel Settings.
                </p>

                <h4 className="font-medium text-indigo-900">Step 3: Create a Webhook</h4>
                <p className="text-sm text-gray-700">
                    • In the left menu, click Integrations. <br />
                    • Click on Webhooks. <br />
                    • Then click “New Webhook”.
                </p>

                <h4 className="font-medium text-indigo-900">Step 4: Configure the Webhook</h4>
                <p className="text-sm text-gray-700">
                    • Give your webhook a name (e.g., Fall Detection Bot). <br />
                    • Optionally, set an avatar image. <br />
                    • Make sure the correct channel is selected for posting alerts.
                </p>

                <h4 className="font-medium text-indigo-900">Step 5: Copy the Webhook URL</h4>
                <p className="text-sm text-gray-700">
                    • Click the “Copy Webhook URL” button. <br />
                    • It should look something like: https://discord.com/api/webhooks/xxxxxxxxxx/yyyyyyyyyyyy
                </p>

                <h4 className="font-medium text-indigo-900">Step 6: Paste the URL into Our System</h4>
                <p className="text-sm text-gray-700">
                    • Go back to our website or system settings page. <br />
                    • Paste your copied webhook URL into the “Discord Webhook URL” field. <br />
                    • Click Save or Submit to complete.
                </p>
            </div>
        </div>
    );
}

export default WebhookModal;
