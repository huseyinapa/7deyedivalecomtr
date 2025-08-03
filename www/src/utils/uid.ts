import { uid } from "uid";

/**
 * Creates a unique identifier for an application
 * @param length - The length of the UID
 * @returns A unique identifier with 'App-' prefix
 */
function createApplicationUID(length = 7): string {
  const _uid = uid(length);
  return `App-${_uid}`;
}

/**
 * Creates a unique identifier for a call
 * @param length - The length of the UID
 * @returns A unique identifier with 'Call-' prefix
 */
function createCallUID(length = 7): string {
  const _uid = uid(length);
  return `Call-${_uid}`;
}

/**
 * Creates a unique identifier for a service
 * @param length - The length of the UID
 * @returns A unique identifier with 'Service-' prefix
 */
function createServiceUID(length = 7): string {
  const _uid = uid(length);
  return `Service-${_uid}`;
}

export default { createApplicationUID, createCallUID, createServiceUID };
