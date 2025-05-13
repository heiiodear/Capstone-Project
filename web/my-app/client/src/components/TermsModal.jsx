import React, { useState } from "react";

function TermsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-lg shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-4">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 text-xl font-bold m-4">
                    ✕
                </button>
                <h2 className="text-lg font-semibold text-indigo-900">
                    Terms and Conditions
                </h2>
                <p className="text-sm text-gray-700">
                    Please read these Terms and Conditions carefully before using our website or services. By accessing or using this website, you agree to be bound by these Terms. If you do not agree with any part of the Terms, you must not use the service.
                </p>
                <h4 className="font-medium text-indigo-900">1. Service Description</h4>
                <p className="text-sm text-gray-700">
                    Our system is designed to detect human falls within a household environment using connected cameras. In the event of a fall, the system will send notifications to the registered caregiver(s) via email and Discord.
                </p>
                <h4 className="font-medium text-indigo-900">2. User Responsibilities</h4>
                <p className="text-sm text-gray-700">
                    •    Users are responsible for installing cameras in appropriate locations and ensuring they remain connected to the internet. <br />
                    •    Users must provide accurate and up-to-date contact information for notifications (e.g., email and Discord webhook). <br />
                    •    Users must not use the service to infringe upon the privacy of others or for any illegal activities.
                </p>
                <h4 className="font-medium text-indigo-900">3. Privacy and Data Collection</h4>
                <p className="text-sm text-gray-700">
                    •    The system may process real-time camera footage solely for the purpose of fall detection. No video or image data is permanently stored unless explicitly configured by the user. <br />
                    •    Personal information (such as email and Discord webhook URLs) will only be used to facilitate alert notifications. <br />
                    •    We comply with applicable data protection laws, including the Personal Data Protection Act (PDPA) of Thailand.
                </p>
                <h4 className="font-medium text-indigo-900">4. Limitation of Liability</h4>
                <p className="text-sm text-gray-700">
                    While we strive to provide accurate and reliable fall detection, we do not guarantee the detection of every fall. We shall not be held liable for any injuries, damages, or losses resulting from false positives, undetected incidents, or system malfunctions.
                </p>
                <h4 className="font-medium text-indigo-900">5. Service Changes</h4>
                <p className="text-sm text-gray-700">
                    We reserve the right to modify, suspend, or discontinue any aspect of the service at any time without prior notice.
                </p>
                <h4 className="font-medium text-indigo-900">6. Intellectual Property</h4>
                <p className="text-sm text-gray-700">
                    All content and technology provided on this website, including code, interface, and logos, are the intellectual property of the service provider and may not be copied or used for commercial purposes without permission.
                </p>
                <h4 className="font-medium text-indigo-900">7. Governing Law</h4>
                <p className="text-sm text-gray-700">
                    These Terms are governed by and construed in accordance with the laws of Thailand. Any disputes arising out of or in connection with these Terms shall be subject to the exclusive jurisdiction of Thai courts.
                </p>
            </div>
                    
        </div>
    );
}

export default TermsModal;

