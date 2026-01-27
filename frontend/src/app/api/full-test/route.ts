import { NextRequest } from 'next/server';
import { validateSessionServer } from '@/lib/auth-server';

// Comprehensive test to verify all functionality: create, read, update, delete tasks
export async function GET(request: NextRequest) {
  try {
    // Validate session first
    const session = await validateSessionServer();

    if (!session || !session.user) {
      return Response.json({
        error: 'Not authenticated',
        tests_passed: 0,
        tests_total: 5, // Total tests to be run
        timestamp: new Date().toISOString()
      });
    }

    const userId = session.user.id;
    const results: any = {
      user_authenticated: true,
      user_id: userId,
      timestamp: new Date().toISOString(),
      tests: {}
    };

    let testsPassed = 0;
    const totalTests = 5; // Create, Get, Update, Delete, Toggle completion

    // Test 1: Create a test task
    try {
      const createResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': userId,
          'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
        },
        body: JSON.stringify({
          title: 'Test task from full functionality test',
          description: 'This is a test task created during full functionality test',
          completed: false
        })
      });

      const createData = await createResponse.json().catch(() => ({ id: null, error: 'parse_error' }));

      results.tests.create_task = {
        success: createResponse.ok,
        status: createResponse.status,
        data: createData
      };

      if (createResponse.ok && createData.id) {
        testsPassed++;
        results.created_task_id = createData.id;

        // Test 2: Get the created task
        try {
          const getResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${createData.id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-User-ID': userId,
              'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
            }
          });

          const getData = await getResponse.json().catch(() => ({ error: 'parse_error' }));

          results.tests.get_task = {
            success: getResponse.ok,
            status: getResponse.status,
            data: getData
          };

          if (getResponse.ok) {
            testsPassed++;

            // Test 3: Update the task
            try {
              const updateResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${createData.id}`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                  'X-User-ID': userId,
                  'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
                },
                body: JSON.stringify({
                  title: 'Updated test task',
                  description: 'This task has been updated',
                  completed: false
                })
              });

              const updateData = await updateResponse.json().catch(() => ({ error: 'parse_error' }));

              results.tests.update_task = {
                success: updateResponse.ok,
                status: updateResponse.status,
                data: updateData
              };

              if (updateResponse.ok) {
                testsPassed++;

                // Test 4: Toggle task completion
                try {
                  const toggleResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${createData.id}/complete`, {
                    method: 'PATCH',
                    headers: {
                      'Content-Type': 'application/json',
                      'X-User-ID': userId,
                      'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
                    }
                  });

                  const toggleData = await toggleResponse.json().catch(() => ({ error: 'parse_error' }));

                  results.tests.toggle_completion = {
                    success: toggleResponse.ok,
                    status: toggleResponse.status,
                    data: toggleData
                  };

                  if (toggleResponse.ok) {
                    testsPassed++;

                    // Test 5: Delete the task
                    try {
                      const deleteResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${createData.id}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                          'X-User-ID': userId,
                          'X-Proxy-Token': process.env.PROXY_AUTH_TOKEN || '',
                        }
                      });

                      results.tests.delete_task = {
                        success: deleteResponse.status === 204 || deleteResponse.ok,
                        status: deleteResponse.status,
                        message: deleteResponse.status === 204 ? 'Deleted successfully' : 'Deletion response'
                      };

                      if (deleteResponse.status === 204 || deleteResponse.ok) {
                        testsPassed++;
                      }
                    } catch (deleteError) {
                      results.tests.delete_task = {
                        success: false,
                        error: (deleteError as Error).message
                      };
                    }
                  } else {
                    results.tests.toggle_completion.error = 'Failed to toggle completion';
                  }
                } catch (toggleError) {
                  results.tests.toggle_completion = {
                    success: false,
                    error: (toggleError as Error).message
                  };
                }
              } else {
                results.tests.update_task.error = 'Failed to update task';
              }
            } catch (updateError) {
              results.tests.update_task = {
                success: false,
                error: (updateError as Error).message
              };
            }
          } else {
            results.tests.get_task.error = 'Failed to get task';
          }
        } catch (getError) {
          results.tests.get_task = {
            success: false,
            error: (getError as Error).message
          };
        }
      } else {
        results.tests.create_task.error = 'Failed to create task';
      }
    } catch (createError) {
      results.tests.create_task = {
        success: false,
        error: (createError as Error).message
      };
    }

    results.tests_passed = testsPassed;
    results.tests_total = totalTests;
    results.all_tests_passed = testsPassed === totalTests;

    return Response.json(results);
  } catch (error) {
    console.error('Full functionality test error:', error);
    return Response.json({
      error: (error as Error).message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}