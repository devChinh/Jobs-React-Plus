export const errorMessageGraphql = (e: any) => {
  // console.log(e?.graphQLErrors);
  if (e?.graphQLErrors && e.graphQLErrors[0]) {
    const ee: any = e.graphQLErrors[0];
    return ee?.extensions?.exception?.response?.error || ee?.extensions?.exception?.response?.message || undefined;
  }
  return undefined;
}